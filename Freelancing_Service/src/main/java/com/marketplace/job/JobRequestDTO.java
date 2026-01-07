package com.marketplace.job;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class JobRequestDTO {

	@NotBlank(message = "Title is required")
	@Size(min = 5, max = 200,  message = "Title must be between 5 and 200 characters")
	private String title;
	
	@NotBlank(message = "Title is required")
	@Size(min = 20, max = 5000,  message = "description must be between 20 and 5000 characters")
	private String description;
	
	@NotNull(message = "Job type is required")
	private JobType type;
	
	@NotNull(message = "Budget is required")
	@DecimalMin(value = "1.00", message = "Budget must be at least 1.00")
	private BigDecimal budget;
	
	@NotNull(message = "Estimated duration is required")
	@Min(value = 1, message = "Duration must be at least 1")
	private Integer estimatedDuration;
	
    private LocalDateTime deadline;
	
	private String skillsRequired;

	public LocalDateTime getDeadline() {
		return deadline;
	}

	public void setDeadline(LocalDateTime deadline) {
		this.deadline = deadline;
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

	public String getSkillsRequired() {
		return skillsRequired;
	}

	public void setSkillsRequired(String skillsRequired) {
		this.skillsRequired = skillsRequired;
	}
}
