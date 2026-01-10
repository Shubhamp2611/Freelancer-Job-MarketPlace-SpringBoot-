package com.marketplace.contract;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateContractDTO {
    
	@NotNull(message = "Proposal ID is required")
	private Long proposalId;
	
	@NotBlank(message = "Title is required")
	private String title;
	
	@NotBlank(message = "Description is required")
	private String description;
	
    @NotNull(message = "Due date is required")
    @FutureOrPresent(message = "Due date must be in the future")
    private LocalDateTime dueDate;
	
	@NotNull(message = "Start date is required")
	//@FutureOrPresent(message = "Start date must be today or in the future")
	private LocalDateTime startDate;
	
	//@NotNull(message = "Deadline is required")
	//@FutureOrPresent(message = "Deadline must be in the future")
	private LocalDateTime deadline;
	
	private List<MilestoneRequestDTO> milestones;

	public Long getProposalId() {
		return proposalId;
	}

	public void setProposalId(Long proposalId) {
		this.proposalId = proposalId;
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

	public LocalDateTime getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDateTime startDate) {
		this.startDate = startDate;
	}

	public LocalDateTime getDeadline() {
		return deadline;
	}

	public void setDeadline(LocalDateTime deadline) {
		this.deadline = deadline;
	}
	
    public LocalDateTime getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

	public List<MilestoneRequestDTO> getMilestones() {
		return milestones;
	}

	public void setMilestones(List<MilestoneRequestDTO> milestones) {
		this.milestones = milestones;
	}
}
