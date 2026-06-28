package com.skillpath.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class RoadmapRequest {
    @NotBlank(message = "Target role is required")
    private String targetRole;

    @NotNull(message = "Skill level is required")
    private String skillLevel;
}
