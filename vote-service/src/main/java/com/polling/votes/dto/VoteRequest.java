package com.polling.votes.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class VoteRequest {

    @NotNull(message = "Poll ID is required")
    @Positive(message = "Poll ID must be positive")
    private Long pollId;

    @NotNull(message = "Option ID is required")
    @Positive(message = "Option ID must be positive")
    private Long optionId;
}
