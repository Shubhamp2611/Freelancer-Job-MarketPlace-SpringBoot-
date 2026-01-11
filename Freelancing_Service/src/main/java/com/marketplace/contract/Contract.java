package com.marketplace.contract;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.marketplace.job.Job;
import com.marketplace.proposal.Proposal;
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
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "contracts")
public class Contract {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@OneToOne
	@JoinColumn(name = "proposal_id", nullable = false, unique = true)
	private Proposal proposal;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "client_id", nullable = false)
	private User client;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "freelancer_id", nullable = false)
	private User freelancer;
	
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "job_id", nullable = false)
	private Job job;
	
	@Column(nullable = false)
	private String title;
	
	@Column(columnDefinition = "TEXT", nullable = false)
	private String description;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ContractStatus status = ContractStatus.ACTIVE;
	
	@Column(nullable = false)
	private BigDecimal totalAmount;
	
	@Column(nullable = false)
	private BigDecimal platformFee; // Platform commission (e.g., 10%)
	
	@Column(nullable = false)
    private BigDecimal freelancerEarnings; // Total minus platform fee
	
	@Column(nullable = false)
	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
	@JsonProperty("startDate")
	private LocalDateTime startDate;
	
	// MISSING FIELD: Add this!
	@Column(name = "due_date")
	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
	@JsonProperty("dueDate")  // This tells Jackson to map JSON's "dueDate" to this field
	private LocalDateTime dueDate;
	
	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
	@JsonProperty("endDate")
	private LocalDateTime endDate;
	
	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
	@JsonProperty("deadline")
	private LocalDateTime deadline;
	
	@Column(nullable = false)
	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
	@JsonProperty("createdAt")
	private LocalDateTime createdAt = LocalDateTime.now();
	
	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
	@JsonProperty("completedAt")
	private LocalDateTime completedAt;
	
	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
	@JsonProperty("cancelledAt")
	private LocalDateTime cancelledAt;
	
	@Column(columnDefinition = "TEXT")
	private String cancellationReason;
	
	private Integer clientRating; // 1-5 stars
	private Integer freelancerRating; // 1-5 stars
	
	@Column(columnDefinition = "TEXT")
	private String clientReview;
	
	@Column(columnDefinition = "TEXT")
	private String freelancerReview;
	
	//Payment Status
	@Column(nullable = false)
	private Boolean escrowFunded = false;
	
	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
	@JsonProperty("escrowFundedAt")
	private LocalDateTime escrowFundedAt;
	
	private BigDecimal amountPaidToFreelancer = BigDecimal.ZERO;
	private BigDecimal amountInEscrow = BigDecimal.ZERO;
	
	// Platform protection period(days)
	@Column(nullable = false)
	private Integer protectionPeriod = 14;

	public Contract() {
		super();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Proposal getProposal() {
		return proposal;
	}

	public void setProposal(Proposal proposal) {
		this.proposal = proposal;
	}

	public User getClient() {
		return client;
	}

	public void setClient(User client) {
		this.client = client;
	}

	public User getFreelancer() {
		return freelancer;
	}

	public void setFreelancer(User freelancer) {
		this.freelancer = freelancer;
	}

	public Job getJob() {
		return job;
	}

	public void setJob(Job job) {
		this.job = job;
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
	
	public void setTotalAmount(BigDecimal totalAmount) {
	    this.totalAmount = totalAmount;
	    // Auto-calculate platform fee (10%)
	    this.platformFee = totalAmount.multiply(new BigDecimal("0.10"));
	    this.freelancerEarnings = totalAmount.subtract(platformFee);
    }
    
    // ADD THIS MISSING GETTER/SETTER
    public LocalDateTime getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

	public void setStartDate(LocalDateTime startDate) {
		this.startDate = startDate;
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

	public LocalDateTime getCompletedAt() {
		return completedAt;
	}

	public void setCompletedAt(LocalDateTime completedAt) {
		this.completedAt = completedAt;
	}

	public LocalDateTime getCancelledAt() {
		return cancelledAt;
	}

	public void setCancelledAt(LocalDateTime cancelledAt) {
		this.cancelledAt = cancelledAt;
	}

	public String getCancellationReason() {
		return cancellationReason;
	}

	public void setCancellationReason(String cancellationReason) {
		this.cancellationReason = cancellationReason;
	}

	public Integer getClientRating() {
		return clientRating;
	}

	public void setClientRating(Integer clientRating) {
		if(clientRating != null && (clientRating < 1 || clientRating > 5)) {
			throw new IllegalArgumentException("Rating must be between 1 and 5");
		}
		this.clientRating = clientRating;
	}

	public Integer getFreelancerRating() {
		return freelancerRating;
	}

	// FIX THIS METHOD - was checking clientRating instead of freelancerRating
	public void setFreelancerRating(Integer freelancerRating) {
		if(freelancerRating != null && (freelancerRating < 1 || freelancerRating > 5)) {
			throw new IllegalArgumentException("Rating must be between 1 and 5");
		}
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

	public Boolean getEscrowFunded() {
		return escrowFunded;
	}

	public void setEscrowFunded(Boolean escrowFunded) {
		this.escrowFunded = escrowFunded;
		if(escrowFunded) {
			this.escrowFundedAt = LocalDateTime.now();
			this.amountInEscrow = this.totalAmount;
		}
	}

	public LocalDateTime getEscrowFundedAt() {
		return escrowFundedAt;
	}

	public void setEscrowFundedAt(LocalDateTime escrowFundedAt) {
		this.escrowFundedAt = escrowFundedAt;
	}

	public BigDecimal getAmountPaidToFreelancer() {
		return amountPaidToFreelancer;
	}

	public void setAmountPaidToFreelancer(BigDecimal amountPaidToFreelancer) {
		this.amountPaidToFreelancer = amountPaidToFreelancer;
		this.amountInEscrow = this.totalAmount.subtract(amountPaidToFreelancer);
	}

	public BigDecimal getAmountInEscrow() {
		return amountInEscrow;
	}

	public void setAmountInEscrow(BigDecimal amountInEscrow) {
		this.amountInEscrow = amountInEscrow;
	}

	public Integer getProtectionPeriod() {
		return protectionPeriod;
	}

	public void setProtectionPeriod(Integer protectionPeriod) {
		this.protectionPeriod = protectionPeriod;
	}
}