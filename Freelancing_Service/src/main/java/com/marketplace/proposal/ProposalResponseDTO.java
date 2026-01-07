package com.marketplace.proposal;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProposalResponseDTO {

	private Long id;
	private Long jobId;
	private String jobTitle;
	private Long freelancerId;
	private String freelancerName;
	private String freelancerEmail;
	private String coverLetter;
	private BigDecimal proposedPrice;
	private Integer estimatedDays;
	private ProposalStatus status;
	private LocalDateTime submittedAt;
	private LocalDateTime respondedAt;
	private String clientMessage;
	private BigDecimal jobBudget;
	
	public ProposalResponseDTO() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ProposalResponseDTO(Long id, Long jobId, String jobTitle, Long freelancerId, String freelancerName,
			String freelancerEmail, String coverLetter, BigDecimal proposedPrice, Integer estimatedDays,
			ProposalStatus status, LocalDateTime submittedAt, LocalDateTime respondedAt, String clientMessage,
			BigDecimal jobBudget) {
		super();
		this.id = id;
		this.jobId = jobId;
		this.jobTitle = jobTitle;
		this.freelancerId = freelancerId;
		this.freelancerName = freelancerName;
		this.freelancerEmail = freelancerEmail;
		this.coverLetter = coverLetter;
		this.proposedPrice = proposedPrice;
		this.estimatedDays = estimatedDays;
		this.status = status;
		this.submittedAt = submittedAt;
		this.respondedAt = respondedAt;
		this.clientMessage = clientMessage;
		this.jobBudget = jobBudget;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public void setJobTitle(String jobTile) {
		this.jobTitle = jobTile;
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

	public String getFreelancerEmail() {
		return freelancerEmail;
	}

	public void setFreelancerEmail(String freelancerEmail) {
		this.freelancerEmail = freelancerEmail;
	}

	public String getCoverLetter() {
		return coverLetter;
	}

	public void setCoverLetter(String coverLetter) {
		this.coverLetter = coverLetter;
	}

	public BigDecimal getProposedPrice() {
		return proposedPrice;
	}

	public void setProposedPrice(BigDecimal proposedPrice) {
		this.proposedPrice = proposedPrice;
	}

	public Integer getEstimatedDays() {
		return estimatedDays;
	}

	public void setEstimatedDays(Integer estimatedDays) {
		this.estimatedDays = estimatedDays;
	}

	public ProposalStatus getStatus() {
		return status;
	}

	public void setStatus(ProposalStatus status) {
		this.status = status;
	}

	public LocalDateTime getSubmittedAt() {
		return submittedAt;
	}

	public void setSubmittedAt(LocalDateTime submittedAt) {
		this.submittedAt = submittedAt;
	}

	public LocalDateTime getRespondedAt() {
		return respondedAt;
	}

	public void setRespondedAt(LocalDateTime respondedAt) {
		this.respondedAt = respondedAt;
	}

	public String getClientMessage() {
		return clientMessage;
	}

	public void setClientMessage(String clientMessage) {
		this.clientMessage = clientMessage;
	}

	public BigDecimal getJobBudget() {
		return jobBudget;
	}

	public void setJobBudget(BigDecimal jobBudget) {
		this.jobBudget = jobBudget;
	}
}
