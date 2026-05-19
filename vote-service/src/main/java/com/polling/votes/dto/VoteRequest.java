package com.polling.votes.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VoteRequest {

    @NotNull(message = "Poll ID is required")
    private Long pollId;

    @NotNull(message = "Option ID is required")
    private Long optionId;
}
