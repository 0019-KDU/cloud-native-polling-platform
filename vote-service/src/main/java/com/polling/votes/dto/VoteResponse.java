package com.polling.votes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoteResponse {
    private Long voteId;
    private Long pollId;
    private Long optionId;
    private LocalDateTime createdAt;
    private Map<Long, Long> currentResults;
    private long totalVotes;
}
