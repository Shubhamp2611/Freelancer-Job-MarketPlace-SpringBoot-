package com.marketplace.dispute;

import com.marketplace.contract.Contract;
import com.marketplace.user.User;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "disputes")
public class Dispute {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "raised_by", nullable = false)
    private User raisedBy; // Who raised the dispute
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DisputeReason reason;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DisputeStatus status = DisputeStatus.OPEN;
    
    @Column(nullable = false)
    private LocalDateTime raisedAt = LocalDateTime.now();
    
    private LocalDateTime resolvedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolved_by")
    private User resolvedBy; // Admin who resolved
    
    @Column(columnDefinition = "TEXT")
    private String resolution;
    
    // Resolution outcome
    private String outcome; // "REFUND_CLIENT", "PAY_FREELANCER", "PARTIAL_REFUND"
    private BigDecimal refundAmount;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Contract getContract() {
		return contract;
	}
	public void setContract(Contract contract) {
		this.contract = contract;
	}
	public User getRaisedBy() {
		return raisedBy;
	}
	public void setRaisedBy(User raisedBy) {
		this.raisedBy = raisedBy;
	}
	public DisputeReason getReason() {
		return reason;
	}
	public void setReason(DisputeReason reason) {
		this.reason = reason;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public DisputeStatus getStatus() {
		return status;
	}
	public void setStatus(DisputeStatus status) {
		this.status = status;
	}
	public LocalDateTime getRaisedAt() {
		return raisedAt;
	}
	public void setRaisedAt(LocalDateTime raisedAt) {
		this.raisedAt = raisedAt;
	}
	public LocalDateTime getResolvedAt() {
		return resolvedAt;
	}
	public void setResolvedAt(LocalDateTime resolvedAt) {
		this.resolvedAt = resolvedAt;
	}
	public User getResolvedBy() {
		return resolvedBy;
	}
	public void setResolvedBy(User resolvedBy) {
		this.resolvedBy = resolvedBy;
	}
	public String getResolution() {
		return resolution;
	}
	public void setResolution(String resolution) {
		this.resolution = resolution;
	}
	public String getOutcome() {
		return outcome;
	}
	public void setOutcome(String outcome) {
		this.outcome = outcome;
	}
	public BigDecimal getRefundAmount() {
		return refundAmount;
	}
	public void setRefundAmount(BigDecimal refundAmount) {
		this.refundAmount = refundAmount;
	}
}