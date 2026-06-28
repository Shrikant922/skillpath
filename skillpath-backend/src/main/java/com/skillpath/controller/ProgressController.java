package com.skillpath.controller;

import com.skillpath.dto.UserProgressResponse;
import com.skillpath.service.ProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping("/stats")
    public ResponseEntity<UserProgressResponse> getProgressStats(@AuthenticationPrincipal UserDetails userDetails) {
        UserProgressResponse stats = progressService.getUserStats(userDetails.getUsername());
        return ResponseEntity.ok(stats);
    }
}
