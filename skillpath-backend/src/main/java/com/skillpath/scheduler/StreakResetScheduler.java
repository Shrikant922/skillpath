package com.skillpath.scheduler;

import com.skillpath.entity.User;
import com.skillpath.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
public class StreakResetScheduler {

    private static final Logger logger = LoggerFactory.getLogger(StreakResetScheduler.class);
    private final UserRepository userRepository;

    public StreakResetScheduler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Runs every day at midnight (00:00:00)
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void resetMissedStreaks() {
        logger.info("Running daily streak reset job...");
        LocalDate yesterday = LocalDate.now().minusDays(1);
        
        // Find all users whose last activity date is strictly before yesterday
        // For larger scales, this should be done directly via an UPDATE query
        List<User> users = userRepository.findAll();
        int resetCount = 0;
        for (User user : users) {
            LocalDate lastActivity = user.getLastActivityDate();
            if (lastActivity != null && lastActivity.isBefore(yesterday) && user.getCurrentStreak() > 0) {
                user.setCurrentStreak(0);
                userRepository.save(user);
                resetCount++;
            }
        }
        logger.info("Reset streaks for {} users", resetCount);
    }
}
