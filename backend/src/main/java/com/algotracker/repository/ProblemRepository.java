package com.algotracker.repository;

import com.algotracker.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    // JpaRepository provides:
    // - save(Problem) - Create/Update
    // - findById(Long) - Read by ID
    // - findAll() - Read all
    // - deleteById(Long) - Delete
    // - count() - Count all
    
    // Custom query methods can be added here if needed
    // For example:
    // List<Problem> findByDifficulty(String difficulty);
    // List<Problem> findByPlatform(String platform);
}
