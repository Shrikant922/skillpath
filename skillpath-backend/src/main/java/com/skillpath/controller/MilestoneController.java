package com.skillpath.controller;

import com.skillpath.service.ProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/milestone")
public class MilestoneController {

    private final ProgressService progressService;

    public MilestoneController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<String> completeMilestone(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        progressService.markMilestoneComplete(id, userDetails.getUsername());
        return ResponseEntity.ok("Milestone marked as complete and streak updated!");
    }
}
