package com.marketplace.job;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class JobResponseDTO {

	private Long id;
	private String title;
	private String description;
	private JobStatus status;
	private JobType type;
	private BigDecimal budget;
	private Integer estimatedDuration;
	private Long clientId;
	private String clientName;
	private Long assignedFreeLancerId;
	private String skillsRequired;
	private LocalDateTime createdAt;
	private LocalDateTime deadline;
	public JobResponseDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public JobResponseDTO(String title, String description, JobStatus status, JobType type, BigDecimal budget,
			Integer estimatedDuration, Long clientId, String clientName, Long assignedFreeLancerId,
			String skillsRequired, LocalDateTime createdAt, LocalDateTime deadline) {
		super();
		this.title = title;
		this.description = description;
		this.status = status;
		this.type = type;
		this.budget = budget;
		this.estimatedDuration = estimatedDuration;
		this.clientId = clientId;
		this.clientName = clientName;
		this.assignedFreeLancerId = assignedFreeLancerId;
		this.skillsRequired = skillsRequired;
		this.createdAt = createdAt;
		this.deadline = deadline;
	}
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
	public Long getClientId() {
		return clientId;
	}
	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}
	public String getClientName() {
		return clientName;
	}
	public void setClientName(String clientName) {
		this.clientName = clientName;
	}
	public Long getAssignedFreeLancerId() {
		return assignedFreeLancerId;
	}
	public void setAssignedFreeLancerId(Long assignedFreeLancerId) {
		this.assignedFreeLancerId = assignedFreeLancerId;
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
