package com.marketplace.proposal;

public enum ProposalStatus {
	    PENDING,      // Proposal submitted, waiting for client response
	    ACCEPTED,     // Client accepted the proposal
	    REJECTED,     // Client rejected the proposal
	    WITHDRAWN,    // Freelancer withdrew the proposal
	    EXPIRED       // Job expired before response
}
