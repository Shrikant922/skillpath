package com.skillpath.controller;

import com.skillpath.dto.RoadmapRequest;
import com.skillpath.dto.RoadmapResponse;
import com.skillpath.service.RoadmapService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/roadmap")
public class RoadmapController {

    private final RoadmapService roadmapService;

    public RoadmapController(RoadmapService roadmapService) {
        this.roadmapService = roadmapService;
    }

    @PostMapping("/generate")
    public ResponseEntity<RoadmapResponse> generateRoadmap(@Valid @RequestBody RoadmapRequest request) {
        RoadmapResponse response = roadmapService.generateAndSaveRoadmap(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoadmapResponse> getRoadmap(@PathVariable Long id) {
        RoadmapResponse response = roadmapService.getRoadmapById(id);
        return ResponseEntity.ok(response);
    }
}
