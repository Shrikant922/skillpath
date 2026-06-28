package com.skillpath.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class RoadmapResponse {
    private Long id;
    private String targetRole;
    private String skillLevel;
    private List<MilestoneResponse> milestones;
}
