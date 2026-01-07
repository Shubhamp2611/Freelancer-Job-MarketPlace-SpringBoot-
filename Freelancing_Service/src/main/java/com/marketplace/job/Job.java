package com.marketplace.job;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.marketplace.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Job {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@Column(nullable = false)
	private String title;
	
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private JobStatus status = JobStatus.OPEN;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private JobType type;
	
	@Column(nullable = false)
	private BigDecimal budget;
	
	@Column(nullable = false)
	private Integer estimatedDuration;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "client_id", nullable = false)
	private User assignedFreelancer;
	
	private String skillsRequired;
	
	@Column(nullable = false)
	private LocalDateTime createdAt = LocalDateTime.now();
	
	private LocalDateTime deadline;

	public Job() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Job(String title, String description, JobType type, BigDecimal budget, Integer estimatedDuration,
			User assignedFreelancer) {
		super();
		this.title = title;
		this.description = description;
		this.type = type;
		this.budget = budget;
		this.estimatedDuration = estimatedDuration;
		this.assignedFreelancer = assignedFreelancer;
	}

	public Job(String title, String description, JobStatus status, JobType type, BigDecimal budget,
			Integer estimatedDuration, User assignedFreelancer, String skillsRequired, LocalDateTime createdAt,
			LocalDateTime deadline) {
		super();
		this.title = title;
		this.description = description;
		this.status = status;
		this.type = type;
		this.budget = budget;
		this.estimatedDuration = estimatedDuration;
		this.assignedFreelancer = assignedFreelancer;
		this.skillsRequired = skillsRequired;
		this.createdAt = createdAt;
		this.deadline = deadline;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
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

	public JobStatus getStatus() {
		return status;
	}

	public void setStatus(JobStatus status) {
		this.status = status;
	}

	public JobType getType() {
		return type;
	}

	public void setType(JobType type) {
		this.type = type;
	}

	public BigDecimal getBudget() {
		return budget;
	}

	public void setBudget(BigDecimal budget) {
		this.budget = budget;
	}

	public Integer getEstimatedDuration() {
		return estimatedDuration;
	}

	public void setEstimatedDuration(Integer estimatedDuration) {
		this.estimatedDuration = estimatedDuration;
	}

	public User getAssignedFreelancer() {
		return assignedFreelancer;
	}

	public void setAssignedFreelancer(User assignedFreelancer) {
		this.assignedFreelancer = assignedFreelancer;
	}

	public String getSkillsRequired() {
		return skillsRequired;
	}

	public void setSkillsRequired(String skillsRequired) {
		this.skillsRequired = skillsRequired;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getDeadline() {
		return deadline;
	}

	public void setDeadline(LocalDateTime deadline) {
		this.deadline = deadline;
	}
}
