package com.marketplace.payment;

public enum PaymentStatus {
    PENDING,            // Payment initiated
    PROCESSING,         // Being processed by gateway
    COMPLETED,          // Successfully completed
    FAILED,             // Payment failed
    REFUNDED,           // Payment refunded
    DISPUTED            // Payment disputed
}
