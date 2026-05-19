package com.polling.votes.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.polling.votes.dto.VoteRequest;
import com.polling.votes.dto.VoteResponse;
import com.polling.votes.entity.Vote;
import com.polling.votes.exception.DuplicateVoteException;
import com.polling.votes.repository.VoteRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class VoteService {

    private final VoteRepository voteRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    @Value("${redis.vote-channel:vote:updates}")
    private String voteChannel;

    @Transactional
    public VoteResponse castVote(VoteRequest request, HttpServletRequest httpRequest) {
        String fingerprint = buildFingerprint(httpRequest);

        if (voteRepository.existsByPollIdAndVoterFingerprint(request.getPollId(), fingerprint)) {
            throw new DuplicateVoteException("You have already voted in this poll");
        }

        Vote vote = Vote.builder()
                .pollId(request.getPollId())
                .optionId(request.getOptionId())
                .voterFingerprint(fingerprint)
                .build();

        Vote saved = voteRepository.save(vote);
        Map<Long, Long> results = getResultsMap(request.getPollId());
        long totalVotes = voteRepository.countByPollId(request.getPollId());

        publishVoteEvent(request.getPollId(), results, totalVotes);

        log.info("Vote cast: pollId={}, optionId={}", request.getPollId(), request.getOptionId());

        return VoteResponse.builder()
                .voteId(saved.getId())
                .pollId(saved.getPollId())
                .optionId(saved.getOptionId())
                .createdAt(saved.getCreatedAt())
                .currentResults(results)
                .totalVotes(totalVotes)
                .build();
    }

    public Map<Long, Long> getResults(Long pollId) {
        return getResultsMap(pollId);
    }

    public long getTotalVotes(Long pollId) {
        return voteRepository.countByPollId(pollId);
    }

    private Map<Long, Long> getResultsMap(Long pollId) {
        List<Object[]> rows = voteRepository.countVotesByOption(pollId);
        Map<Long, Long> results = new HashMap<>();
        for (Object[] row : rows) {
            results.put((Long) row[0], (Long) row[1]);
        }
        return results;
    }

    private void publishVoteEvent(Long pollId, Map<Long, Long> results, long totalVotes) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("pollId", pollId);
            event.put("results", results);
            event.put("totalVotes", totalVotes);
            String payload = objectMapper.writeValueAsString(event);
            redisTemplate.convertAndSend(voteChannel, payload);
            log.debug("Published vote event for pollId={}", pollId);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize vote event: {}", e.getMessage());
        }
    }

    private String buildFingerprint(HttpServletRequest request) {
        String ipAddress = getClientIp(request);
        String userAgent = request.getHeader("User-Agent") != null ? request.getHeader("User-Agent") : "unknown";
        String raw = ipAddress + "|" + userAgent;
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(raw.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            return raw;
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
