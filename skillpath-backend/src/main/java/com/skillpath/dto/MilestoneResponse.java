package com.skillpath.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MilestoneResponse {
    private Long id;
    private Integer weekNumber;
    private String title;
    private String description;
    private String resourceLink;
    private Boolean isCompleted;
}
