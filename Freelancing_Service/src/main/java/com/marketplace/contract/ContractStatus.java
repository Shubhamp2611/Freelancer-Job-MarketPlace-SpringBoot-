package com.marketplace.contract;

public enum ContractStatus {
    DRAFT,          // Contract created but not finalized
    ACTIVE,         // Contract is active and work in progress
    COMPLETED,      // Contract completed successfully
    CANCELLED,      // Contract cancelled
    DISPUTED,       // Dispute raised
    ON_HOLD,        // Temporarily paused
    TERMINATED      // Terminated by mutual agreement or rules violation
}
