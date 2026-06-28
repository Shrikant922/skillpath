package com.skillpath.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class UserProgressResponse {
    private int currentStreak;
    private int longestStreak;
    private long totalRoadmaps;
    private long totalMilestonesCompleted;
    private List<RoadmapProgress> roadmapProgress;

    @Data
    @Builder
    public static class RoadmapProgress {
        private Long roadmapId;
        private String targetRole;
        private int totalMilestones;
        private int completedMilestones;
        private double completionPercentage;
    }
}
