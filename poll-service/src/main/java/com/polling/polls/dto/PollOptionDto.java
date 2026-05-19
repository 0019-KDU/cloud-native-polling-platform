package com.polling.polls.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PollOptionDto {
    private Long id;
    private String optionText;
    private Integer displayOrder;
}
