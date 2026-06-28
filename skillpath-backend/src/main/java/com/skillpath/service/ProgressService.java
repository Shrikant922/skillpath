package com.skillpath.service;

import com.skillpath.dto.UserProgressResponse;
import com.skillpath.entity.Milestone;
import com.skillpath.entity.ProgressLog;
import com.skillpath.entity.Roadmap;
import com.skillpath.entity.User;
import com.skillpath.repository.MilestoneRepository;
import com.skillpath.repository.ProgressLogRepository;
import com.skillpath.repository.RoadmapRepository;
import com.skillpath.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProgressService {

    private final UserRepository userRepository;
    private final RoadmapRepository roadmapRepository;
    private final MilestoneRepository milestoneRepository;
    private final ProgressLogRepository progressLogRepository;
    private final StreakService streakService;

    public ProgressService(UserRepository userRepository, RoadmapRepository roadmapRepository,
                           MilestoneRepository milestoneRepository, ProgressLogRepository progressLogRepository,
                           StreakService streakService) {
        this.userRepository = userRepository;
        this.roadmapRepository = roadmapRepository;
        this.milestoneRepository = milestoneRepository;
        this.progressLogRepository = progressLogRepository;
        this.streakService = streakService;
    }

    @Transactional
    public void markMilestoneComplete(Long milestoneId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));

        if (!milestone.getRoadmap().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to modify this milestone");
        }

        if (!milestone.getIsCompleted()) {
            milestone.setIsCompleted(true);
            milestoneRepository.save(milestone);

            ProgressLog log = ProgressLog.builder()
                    .user(user)
                    .milestone(milestone)
                    .roadmap(milestone.getRoadmap())
                    .build();
            progressLogRepository.save(log);

            streakService.updateStreak(user);
        }
    }

    @Transactional(readOnly = true)
    public UserProgressResponse getUserStats(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Roadmap> roadmaps = roadmapRepository.findByUserId(user.getId());
        
        long totalRoadmaps = roadmaps.size();
        long totalMilestonesCompleted = 0;
        List<UserProgressResponse.RoadmapProgress> roadmapProgressList = new ArrayList<>();

        for (Roadmap r : roadmaps) {
            List<Milestone> milestones = milestoneRepository.findByRoadmapId(r.getId());
            int total = milestones.size();
            int completed = 0;
            for (Milestone m : milestones) {
                if (m.getIsCompleted()) {
                    completed++;
                    totalMilestonesCompleted++;
                }
            }
            double percentage = total == 0 ? 0 : ((double) completed / total) * 100.0;
            
            roadmapProgressList.add(UserProgressResponse.RoadmapProgress.builder()
                    .roadmapId(r.getId())
                    .targetRole(r.getTargetRole())
                    .totalMilestones(total)
                    .completedMilestones(completed)
                    .completionPercentage(percentage)
                    .build());
        }

        return UserProgressResponse.builder()
            .currentStreak(user.getCurrentStreak())
            .longestStreak(user.getLongestStreak())
            .totalRoadmaps(totalRoadmaps)
            .totalMilestonesCompleted(totalMilestonesCompleted)
            .roadmapProgress(roadmapProgressList)
            .build();
    }
}
