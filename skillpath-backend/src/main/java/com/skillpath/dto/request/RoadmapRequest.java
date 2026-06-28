package com.skillpath.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoadmapRequest {

    @NotBlank(message = "Topic is required")
    private String topic;

    @NotBlank(message = "Current skill level is required")
    private String currentLevel;

    @NotNull(message = "Target role is required")
    private String targetRole;

    @NotNull(message = "Skill level is required")
    private String skillLevel; // BEGINNER | INTERMEDIATE | ADVANCED
}
