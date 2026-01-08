package com.marketplace.contract;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "milestones")
public class Milestone {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;
    
    @Column(nullable = false)
    private BigDecimal amount;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MilestoneStatus status = MilestoneStatus.PENDING;
    
    @Column(nullable = false)
    private LocalDateTime dueDate;
    
    private LocalDateTime completedAt;
    
    private LocalDateTime paidAt;
    
    @Column(columnDefinition = "TEXT")
    private String deliverables; // Comma-separated list of deliverables
    
    @Column(columnDefinition = "TEXT")
    private String clientFeedback;
    
    @Column(nullable = false)
    private Integer sequence; // Order of milestones (1, 2, 3...)
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Constructors
    public Milestone() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Contract getContract() { return contract; }
    public void setContract(Contract contract) { this.contract = contract; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public MilestoneStatus getStatus() { return status; }
    public void setStatus(MilestoneStatus status) { 
        this.status = status;
        if (status == MilestoneStatus.COMPLETED) {
            this.completedAt = LocalDateTime.now();
        } else if (status == MilestoneStatus.PAID) {
            this.paidAt = LocalDateTime.now();
        }
    }
    
    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    
    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }
    
    public String getDeliverables() { return deliverables; }
    public void setDeliverables(String deliverables) { this.deliverables = deliverables; }
    
    public String getClientFeedback() { return clientFeedback; }
    public void setClientFeedback(String clientFeedback) { this.clientFeedback = clientFeedback; }
    
    public Integer getSequence() { return sequence; }
    public void setSequence(Integer sequence) { this.sequence = sequence; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}