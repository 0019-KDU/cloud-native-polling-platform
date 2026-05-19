package com.polling.polls.service;

import com.polling.polls.dto.CreatePollRequest;
import com.polling.polls.dto.PollOptionDto;
import com.polling.polls.dto.PollResponse;
import com.polling.polls.entity.Poll;
import com.polling.polls.entity.PollOption;
import com.polling.polls.entity.PollStatus;
import com.polling.polls.exception.PollNotFoundException;
import com.polling.polls.repository.PollRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class PollService {

    private final PollRepository pollRepository;

    public List<PollResponse> getAllPolls() {
        return pollRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<PollResponse> getActivePolls() {
        return pollRepository.findByStatus(PollStatus.ACTIVE)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public PollResponse getPollById(Long id) {
        Poll poll = pollRepository.findById(id)
                .orElseThrow(() -> new PollNotFoundException("Poll not found: " + id));
        return toResponse(poll);
    }

    @Transactional
    public PollResponse createPoll(CreatePollRequest request, String createdBy) {
        Poll poll = Poll.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(PollStatus.DRAFT)
                .createdBy(createdBy)
                .endsAt(request.getEndsAt())
                .build();

        List<PollOption> options = IntStream.range(0, request.getOptions().size())
                .mapToObj(i -> PollOption.builder()
                        .poll(poll)
                        .optionText(request.getOptions().get(i))
                        .displayOrder(i)
                        .build())
                .collect(Collectors.toList());

        poll.setOptions(options);
        Poll saved = pollRepository.save(poll);
        log.info("Poll created: id={}, title={}, by={}", saved.getId(), saved.getTitle(), createdBy);
        return toResponse(saved);
    }

    @Transactional
    public PollResponse activatePoll(Long id, String username) {
        Poll poll = getPollEntity(id);
        poll.setStatus(PollStatus.ACTIVE);
        log.info("Poll activated: id={} by {}", id, username);
        return toResponse(pollRepository.save(poll));
    }

    @Transactional
    public PollResponse endPoll(Long id, String username) {
        Poll poll = getPollEntity(id);
        poll.setStatus(PollStatus.ENDED);
        log.info("Poll ended: id={} by {}", id, username);
        return toResponse(pollRepository.save(poll));
    }

    @Transactional
    public void deletePoll(Long id) {
        Poll poll = getPollEntity(id);
        pollRepository.delete(poll);
        log.info("Poll deleted: id={}", id);
    }

    private Poll getPollEntity(Long id) {
        return pollRepository.findById(id)
                .orElseThrow(() -> new PollNotFoundException("Poll not found: " + id));
    }

    private PollResponse toResponse(Poll poll) {
        List<PollOptionDto> options = poll.getOptions().stream()
                .map(o -> PollOptionDto.builder()
                        .id(o.getId())
                        .optionText(o.getOptionText())
                        .displayOrder(o.getDisplayOrder())
                        .build())
                .collect(Collectors.toList());

        return PollResponse.builder()
                .id(poll.getId())
                .title(poll.getTitle())
                .description(poll.getDescription())
                .status(poll.getStatus())
                .createdBy(poll.getCreatedBy())
                .createdAt(poll.getCreatedAt())
                .updatedAt(poll.getUpdatedAt())
                .endsAt(poll.getEndsAt())
                .options(options)
                .build();
    }
}
