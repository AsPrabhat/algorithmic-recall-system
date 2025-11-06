package com.algotracker.controller;

import com.algotracker.entity.Problem;
import com.algotracker.repository.ProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/problems")
@CrossOrigin(origins = "http://localhost:5173")
public class ProblemController {
    
    @Autowired
    private ProblemRepository problemRepository;
    
    // CREATE - Add a new problem
    @PostMapping
    public ResponseEntity<Problem> createProblem(@RequestBody Problem problem) {
        Problem savedProblem = problemRepository.save(problem);
        return new ResponseEntity<>(savedProblem, HttpStatus.CREATED);
    }
    
    // READ - Get all problems
    @GetMapping
    public ResponseEntity<List<Problem>> getAllProblems() {
        List<Problem> problems = problemRepository.findAll();
        return new ResponseEntity<>(problems, HttpStatus.OK);
    }
    
    // READ - Get a problem by ID
    @GetMapping("/{id}")
    public ResponseEntity<Problem> getProblemById(@PathVariable Long id) {
        Optional<Problem> problem = problemRepository.findById(id);
        return problem.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                     .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    // UPDATE - Update an existing problem
    @PutMapping("/{id}")
    public ResponseEntity<Problem> updateProblem(@PathVariable Long id, @RequestBody Problem problemDetails) {
        Optional<Problem> problemOptional = problemRepository.findById(id);
        
        if (problemOptional.isPresent()) {
            Problem problem = problemOptional.get();
            problem.setTitle(problemDetails.getTitle());
            problem.setDescription(problemDetails.getDescription());
            problem.setDifficulty(problemDetails.getDifficulty());
            problem.setPlatform(problemDetails.getPlatform());
            problem.setUrl(problemDetails.getUrl());
            problem.setLastReviewed(problemDetails.getLastReviewed());
            problem.setNextReview(problemDetails.getNextReview());
            problem.setReviewCount(problemDetails.getReviewCount());
            problem.setNotes(problemDetails.getNotes());
            
            Problem updatedProblem = problemRepository.save(problem);
            return new ResponseEntity<>(updatedProblem, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // DELETE - Delete a problem by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProblem(@PathVariable Long id) {
        Optional<Problem> problem = problemRepository.findById(id);
        
        if (problem.isPresent()) {
            problemRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
