package com.polling.polls.dto;

import com.polling.polls.entity.PollStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PollResponse {
    private Long id;
    private String title;
    private String description;
    private PollStatus status;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime endsAt;
    private List<PollOptionDto> options;
}
