package com.polling.polls.controller;

import com.polling.polls.dto.CreatePollRequest;
import com.polling.polls.dto.PollResponse;
import com.polling.polls.service.PollService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/polls")
@RequiredArgsConstructor
public class PollController {

    private final PollService pollService;

    @GetMapping
    public ResponseEntity<List<PollResponse>> getAllPolls() {
        return ResponseEntity.ok(pollService.getAllPolls());
    }

    @GetMapping("/active")
    public ResponseEntity<List<PollResponse>> getActivePolls() {
        return ResponseEntity.ok(pollService.getActivePolls());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PollResponse> getPollById(@PathVariable Long id) {
        return ResponseEntity.ok(pollService.getPollById(id));
    }

    @PostMapping
    public ResponseEntity<PollResponse> createPoll(@Valid @RequestBody CreatePollRequest request,
                                                    Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(pollService.createPoll(request, auth.getName()));
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<PollResponse> activatePoll(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(pollService.activatePoll(id, auth.getName()));
    }

    @PutMapping("/{id}/end")
    public ResponseEntity<PollResponse> endPoll(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(pollService.endPoll(id, auth.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletePoll(@PathVariable Long id) {
        pollService.deletePoll(id);
        return ResponseEntity.ok(Map.of("message", "Poll deleted successfully"));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "poll-service"));
    }
}
