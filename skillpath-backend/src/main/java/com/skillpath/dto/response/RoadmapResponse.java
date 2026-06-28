package com.skillpath.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class RoadmapResponse {
    private Long id;
    private String targetRole;
    private String skillLevel;
    private LocalDateTime createdAt;
    private List<MilestoneResponse> milestones;

    @Data
    @Builder
    public static class MilestoneResponse {
        private Long id;
        private Integer weekNumber;
        private String title;
        private String description;
        private String resourceLink;
        private Boolean isCompleted;
    }
}
