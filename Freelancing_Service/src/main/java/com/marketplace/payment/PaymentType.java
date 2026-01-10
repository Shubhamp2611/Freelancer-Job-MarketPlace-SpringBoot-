package com.marketplace.payment;

public enum PaymentType {
    ESCROW_DEPOSIT,      // Client deposits to escrow
    MILESTONE_PAYMENT,   // Payment for milestone completion
    PLATFORM_FEE,        // Platform commission
    REFUND,              // Refund to client
    WITHDRAWAL           // Freelancer withdraws earnings
}
