package com.skillpath.service;

import com.skillpath.dto.MilestoneResponse;
import com.skillpath.dto.RoadmapRequest;
import com.skillpath.dto.RoadmapResponse;
import com.skillpath.entity.Milestone;
import com.skillpath.entity.Roadmap;
import com.skillpath.entity.User;
import com.skillpath.repository.RoadmapRepository;
import com.skillpath.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoadmapService {

    private final RoadmapRepository roadmapRepository;
    private final UserRepository userRepository;
    private final GeminiService geminiService;

    public RoadmapService(RoadmapRepository roadmapRepository, UserRepository userRepository, GeminiService geminiService) {
        this.roadmapRepository = roadmapRepository;
        this.userRepository = userRepository;
        this.geminiService = geminiService;
    }

    @Transactional
    public RoadmapResponse generateAndSaveRoadmap(RoadmapRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Milestone> generatedMilestones = geminiService.generateRoadmap(request.getTargetRole(), request.getSkillLevel());
        if (generatedMilestones.size() != 8) {
            throw new RuntimeException("Expected exactly 8 milestones, but got " + generatedMilestones.size());
        }

        Roadmap roadmap = Roadmap.builder()
                .user(user)
                .targetRole(request.getTargetRole())
                .skillLevel(Roadmap.SkillLevel.valueOf(request.getSkillLevel().toUpperCase()))
                .build();

        for (Milestone milestone : generatedMilestones) {
            milestone.setRoadmap(roadmap);
        }
        roadmap.setMilestones(generatedMilestones);

        Roadmap savedRoadmap = roadmapRepository.save(roadmap);

        return mapToResponse(savedRoadmap);
    }

    public RoadmapResponse getRoadmapById(Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Roadmap roadmap = roadmapRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Roadmap not found"));
                
        if (!roadmap.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to access this roadmap");
        }
        
        return mapToResponse(roadmap);
    }

    private RoadmapResponse mapToResponse(Roadmap roadmap) {
        List<MilestoneResponse> milestoneResponses = roadmap.getMilestones().stream()
                .map(m -> MilestoneResponse.builder()
                        .id(m.getId())
                        .weekNumber(m.getWeekNumber())
                        .title(m.getTitle())
                        .description(m.getDescription())
                        .resourceLink(m.getResourceLink())
                        .isCompleted(m.getIsCompleted())
                        .build())
                .collect(Collectors.toList());

        return RoadmapResponse.builder()
                .id(roadmap.getId())
                .targetRole(roadmap.getTargetRole())
                .skillLevel(roadmap.getSkillLevel().name())
                .milestones(milestoneResponses)
                .build();
    }
}
