package com.marketplace.proposal;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ProposalRequestDTO {

	@NotNull(message = "Job ID is required")
	private Long jobId;
	
	@NotBlank(message = "Cover Letter is required")
	@Size(min = 50, max = 5000, message = "Cover letter must be between 50 and 5000 characters")
	private String coverLetter;
	
	@NotNull(message = "Proposed price is required")
	@DecimalMin(value = "1.00", message = "Price must be at least 1.00")
	private BigDecimal proposedPrice;
	
	@NotNull(message = "Estimated days is required")
	@Min(value = 1, message = "Duration must be at least 1 day")
	private Integer estimatedDays;

	public Long getJobId() {
		return jobId;
	}

	public void setJobId(Long jobId) {
		this.jobId = jobId;
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
}
