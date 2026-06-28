package com.skillpath.repository;

import com.skillpath.entity.ProgressLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgressLogRepository extends JpaRepository<ProgressLog, Long> {
}
