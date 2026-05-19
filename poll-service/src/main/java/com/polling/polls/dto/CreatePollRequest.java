package com.polling.polls.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CreatePollRequest {

    @NotBlank(message = "Poll title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @NotEmpty(message = "At least 2 options are required")
    @Size(min = 2, max = 10, message = "Poll must have between 2 and 10 options")
    private List<@NotBlank(message = "Option text cannot be blank") @Size(min = 1, max = 200, message = "Option text cannot exceed 200 characters") String> options;

    private LocalDateTime endsAt;
}
