package com.polling.votes.controller;

import com.polling.votes.dto.VoteRequest;
import com.polling.votes.dto.VoteResponse;
import com.polling.votes.service.VoteService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/votes")
@RequiredArgsConstructor
public class VoteController {

    private final VoteService voteService;

    @PostMapping
    public ResponseEntity<VoteResponse> castVote(@Valid @RequestBody VoteRequest request,
                                                  HttpServletRequest httpRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(voteService.castVote(request, httpRequest));
    }

    @GetMapping("/results/{pollId}")
    public ResponseEntity<Map<String, Object>> getResults(@PathVariable Long pollId) {
        Map<Long, Long> results = voteService.getResults(pollId);
        long total = voteService.getTotalVotes(pollId);
        return ResponseEntity.ok(Map.of(
                "pollId", pollId,
                "results", results,
                "totalVotes", total
        ));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "vote-service"));
    }
}
