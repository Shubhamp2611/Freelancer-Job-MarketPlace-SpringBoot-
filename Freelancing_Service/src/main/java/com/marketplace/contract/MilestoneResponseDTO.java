package com.marketplace.contract;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class MilestoneResponseDTO {
    private Long id;
    private String title;
    private String description;
    private BigDecimal amount;
    private MilestoneStatus status;
    private LocalDateTime dueDate;
    private LocalDateTime completedAt;
    private LocalDateTime paidAt;
    private String deliverables;
    private String clientFeedback;
    private Integer sequence;
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
	public BigDecimal getAmount() {
		return amount;
	}
	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}
	public MilestoneStatus getStatus() {
		return status;
	}
	public void setStatus(MilestoneStatus status) {
		this.status = status;
	}
	public LocalDateTime getDueDate() {
		return dueDate;
	}
	public void setDueDate(LocalDateTime dueDate) {
		this.dueDate = dueDate;
	}
	public LocalDateTime getCompletedAt() {
		return completedAt;
	}
	public void setCompletedAt(LocalDateTime completedAt) {
		this.completedAt = completedAt;
	}
	public LocalDateTime getPaidAt() {
		return paidAt;
	}
	public void setPaidAt(LocalDateTime paidAt) {
		this.paidAt = paidAt;
	}
	public String getDeliverables() {
		return deliverables;
	}
	public void setDeliverables(String deliverables) {
		this.deliverables = deliverables;
	}
	public String getClientFeedback() {
		return clientFeedback;
	}
	public void setClientFeedback(String clientFeedback) {
		this.clientFeedback = clientFeedback;
	}
	public Integer getSequence() {
		return sequence;
	}
	public void setSequence(Integer sequence) {
		this.sequence = sequence;
	}
	public MilestoneResponseDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public MilestoneResponseDTO(String title, String description, BigDecimal amount, MilestoneStatus status,
			LocalDateTime dueDate, LocalDateTime completedAt, LocalDateTime paidAt, String deliverables,
			String clientFeedback, Integer sequence) {
		super();
		this.title = title;
		this.description = description;
		this.amount = amount;
		this.status = status;
		this.dueDate = dueDate;
		this.completedAt = completedAt;
		this.paidAt = paidAt;
		this.deliverables = deliverables;
		this.clientFeedback = clientFeedback;
		this.sequence = sequence;
	}
}