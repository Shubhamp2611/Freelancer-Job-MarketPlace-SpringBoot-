package com.marketplace.contract;

public enum MilestoneStatus {
    PENDING,        // Not started yet
    IN_PROGRESS,    // Work in progress
    SUBMITTED,      // Work submitted for review
    REVISION_REQUESTED, // Client requested revisions
    APPROVED,       // Client approved the work
    COMPLETED,      // Milestone completed
    PAID,           // Payment released to freelancer
    CANCELLED       // Milestone cancelled
}
