package com.marketplace.proposal;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.marketplace.contract.Contract;
import com.marketplace.job.Job;
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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "proposals")
public class Proposal {
    
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "job_id", nullable = false)
	private Job job;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "freelancer_id", nullable = false)
	private User freelancer;
	
	@Column(columnDefinition = "TEXT", nullable = false)
	private String coverLetter;
	
	@Column(nullable = false)
	private BigDecimal proposedPrice;
	
	@Column(nullable = false)
	private Integer estimatedDays;
	
	@OneToOne(mappedBy = "proposal", fetch = FetchType.LAZY)
	@JsonIgnore
	private Contract contract;

	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private  ProposalStatus status = ProposalStatus.PENDING;
	
	@Column(nullable = false)
    private LocalDateTime submittedAt = LocalDateTime.now();
	
	private LocalDateTime respondedAt;
	
	private String clientMessage;// message from client when accepting/rejecting

	public Proposal() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Proposal(Job job, User freelancer, String coverLetter, BigDecimal proposedPrice, Integer estimatedDays) {
		super();
		this.job = job;
		this.freelancer = freelancer;
		this.coverLetter = coverLetter;
		this.proposedPrice = proposedPrice;
		this.estimatedDays = estimatedDays;
	}
	
	public LocalDateTime getSubmittedAt() {
		return submittedAt;
	}

	public void setSubmittedAt(LocalDateTime submittedAt) {
		this.submittedAt = submittedAt;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Job getJob() {
		return job;
	}

	public void setJob(Job job) {
		this.job = job;
	}

	public User getFreelancer() {
		return freelancer;
	}

	public void setFreelancer(User freelancer) {
		this.freelancer = freelancer;
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
}
