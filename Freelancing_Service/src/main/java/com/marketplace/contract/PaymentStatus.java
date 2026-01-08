package com.marketplace.contract;

public enum PaymentStatus {
    PENDING,        // Payment pending
    ESCROW_HOLD,    // Funds in escrow
    PARTIALLY_PAID, // Partial payment released
    FULLY_PAID,     // Full payment released
    REFUNDED,       // Payment refunded to client
    DISPUTED        // Payment disputed
}
