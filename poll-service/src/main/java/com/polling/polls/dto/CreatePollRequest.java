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
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @NotEmpty(message = "At least one option is required")
    @Size(min = 2, message = "At least 2 options are required")
    private List<String> options;

    private LocalDateTime endsAt;
}
