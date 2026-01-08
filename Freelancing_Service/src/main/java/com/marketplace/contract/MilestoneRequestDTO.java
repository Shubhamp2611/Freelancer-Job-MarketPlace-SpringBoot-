package com.marketplace.contract;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MilestoneRequestDTO {

	@NotBlank(message = "Milestone title is required")
    private String title;
    
	@jakarta.validation.constraints.NotBlank(message = "Milestone description is required")
    private String description;
    
    @NotNull(message = "Milestone amount is required")
    @DecimalMin(value = "1.00", message = "Amount must be at least 1.00")
    private BigDecimal amount;
    
    @NotNull(message = "Due date is required")
    @Future(message = "Due date must be in the future")
    private LocalDateTime dueDate;
    
    private String deliverable; // Comma-separated
    
    @NotNull(message = "Sequence is required")
    @Min(value = 1 , message = "Sequence must be at least 1")   
    private Integer sequence;

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

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public LocalDateTime getDueDate() {
		return dueDate;
	}

	public void setDueDate(LocalDateTime dueDate) {
		this.dueDate = dueDate;
	}

	public String getDeliverable() {
		return deliverable;
	}

	public void setDeliverable(String deliverable) {
		this.deliverable = deliverable;
	}

	public Integer getSequence() {
		return sequence;
	}

	public void setSequence(Integer sequence) {
		this.sequence = sequence;
	}
}
