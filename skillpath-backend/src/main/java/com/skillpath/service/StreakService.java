package com.skillpath.service;

import com.skillpath.entity.User;
import com.skillpath.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class StreakService {

    private final UserRepository userRepository;

    public StreakService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public void updateStreak(User user) {
        LocalDate today = LocalDate.now();
        LocalDate lastActivity = user.getLastActivityDate();

        if (lastActivity == null || lastActivity.isBefore(today.minusDays(1))) {
            // First time or missed a day
            user.setCurrentStreak(1);
        } else if (lastActivity.equals(today.minusDays(1))) {
            // Active yesterday
            user.setCurrentStreak(user.getCurrentStreak() + 1);
        }
        // If active today, do nothing to currentStreak

        // Update longest streak if necessary
        if (user.getCurrentStreak() > user.getLongestStreak()) {
            user.setLongestStreak(user.getCurrentStreak());
        }

        user.setLastActivityDate(today);
        userRepository.save(user);
    }
}
