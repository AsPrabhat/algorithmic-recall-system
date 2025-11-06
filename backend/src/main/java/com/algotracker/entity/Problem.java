package com.algotracker.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "problems")
public class Problem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 2000)
    private String description;
    
    @Column(nullable = false)
    private String difficulty; // Easy, Medium, Hard
    
    @Column(nullable = false)
    private String platform; // LeetCode, HackerRank, CodeForces, etc.
    
    private String url;
    
    @Column(name = "last_reviewed")
    private LocalDate lastReviewed;
    
    @Column(name = "next_review")
    private LocalDate nextReview;
    
    @Column(name = "review_count")
    private Integer reviewCount = 0;
    
    @Column(length = 2000)
    private String notes;
    
    // Constructors
    public Problem() {
    }
    
    public Problem(String title, String difficulty, String platform) {
        this.title = title;
        this.difficulty = difficulty;
        this.platform = platform;
        this.reviewCount = 0;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getDifficulty() {
        return difficulty;
    }
    
    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }
    
    public String getPlatform() {
        return platform;
    }
    
    public void setPlatform(String platform) {
        this.platform = platform;
    }
    
    public String getUrl() {
        return url;
    }
    
    public void setUrl(String url) {
        this.url = url;
    }
    
    public LocalDate getLastReviewed() {
        return lastReviewed;
    }
    
    public void setLastReviewed(LocalDate lastReviewed) {
        this.lastReviewed = lastReviewed;
    }
    
    public LocalDate getNextReview() {
        return nextReview;
    }
    
    public void setNextReview(LocalDate nextReview) {
        this.nextReview = nextReview;
    }
    
    public Integer getReviewCount() {
        return reviewCount;
    }
    
    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
}
