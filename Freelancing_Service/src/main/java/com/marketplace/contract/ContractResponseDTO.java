package com.marketplace.contract;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ContractResponseDTO {

	private Long id;
	private Long proposalId;
	private Long jobId;
	private String jobTitle;
    private Long clientId;
	private String clientName;
	private Long freelancerId;
	private String freelancerName;
	private String title;
	private String description;
	private ContractStatus status;
	private BigDecimal totalAmount;
	private BigDecimal platformFee;
	private BigDecimal freelancerEarnings;
	private LocalDateTime startDate;
	private LocalDateTime endDate;
	private LocalDateTime deadline;
	private LocalDateTime createdAt;
	private Boolean escrowFunded;
	private BigDecimal amountPaidToFreelancer;
	private BigDecimal amountInEscrow;
	private Integer clientRating;
	private Integer freelancerRating;
	private String clientReview;
	private String freelancerReview;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getProposalId() {
		return proposalId;
	}
	public void setProposalId(Long proposalId) {
		this.proposalId = proposalId;
	}
	public Long getJobId() {
		return jobId;
	}
	public void setJobId(Long jobId) {
		this.jobId = jobId;
	}
	public String getJobTitle() {
		return jobTitle;
	}
	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}
	public String getClientName() {
		return clientName;
	}
	public void setClientName(String clientName) {
		this.clientName = clientName;
	}
	public Long getFreelancerId() {
		return freelancerId;
	}
	public void setFreelancerId(Long freelancerId) {
		this.freelancerId = freelancerId;
	}
	public String getFreelancerName() {
		return freelancerName;
	}
	public void setFreelancerName(String freelancerName) {
		this.freelancerName = freelancerName;
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
	public ContractStatus getStatus() {
		return status;
	}
	public void setStatus(ContractStatus status) {
		this.status = status;
	}
	public BigDecimal getTotalAmount() {
		return totalAmount;
	}
	public void setTotalAmount(BigDecimal totalAmount) {
		this.totalAmount = totalAmount;
	}
	public BigDecimal getPlatformFee() {
		return platformFee;
	}
	public void setPlatformFee(BigDecimal platformFee) {
		this.platformFee = platformFee;
	}
	public BigDecimal getFreelancerEarnings() {
		return freelancerEarnings;
	}
	public void setFreelancerEarnings(BigDecimal freelancerEarnings) {
		this.freelancerEarnings = freelancerEarnings;
	}
	public LocalDateTime getStartDate() {
		return startDate;
	}
	public void setStartDate(LocalDateTime startDate) {
		this.startDate = startDate;
	}
	
	public Long getClientId() {
		return clientId;
	}
	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}
	public LocalDateTime getEndDate() {
		return endDate;
	}
	public void setEndDate(LocalDateTime endDate) {
		this.endDate = endDate;
	}
	public LocalDateTime getDeadline() {
		return deadline;
	}
	public void setDeadline(LocalDateTime deadline) {
		this.deadline = deadline;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public Boolean getEscrowFunded() {
		return escrowFunded;
	}
	public void setEscrowFunded(Boolean escrowFunded) {
		this.escrowFunded = escrowFunded;
	}
	public BigDecimal getAmountPaidToFreelancer() {
		return amountPaidToFreelancer;
	}
	public void setAmountPaidToFreelancer(BigDecimal amountPaidToFreelancer) {
		this.amountPaidToFreelancer = amountPaidToFreelancer;
	}
	public BigDecimal getAmountInEscrow() {
		return amountInEscrow;
	}
	public void setAmountInEscrow(BigDecimal amountInEscrow) {
		this.amountInEscrow = amountInEscrow;
	}
	public Integer getClientRating() {
		return clientRating;
	}
	public void setClientRating(Integer clientRating) {
		this.clientRating = clientRating;
	}
	public Integer getFreelancerRating() {
		return freelancerRating;
	}
	public void setFreelancerRating(Integer freelancerRating) {
		this.freelancerRating = freelancerRating;
	}
	public String getClientReview() {
		return clientReview;
	}
	public void setClientReview(String clientReview) {
		this.clientReview = clientReview;
	}
	public String getFreelancerReview() {
		return freelancerReview;
	}
	public void setFreelancerReview(String freelancerReview) {
		this.freelancerReview = freelancerReview;
	}
}
