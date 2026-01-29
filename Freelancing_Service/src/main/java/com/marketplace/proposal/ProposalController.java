package com.marketplace.proposal;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.marketplace.security.SecurityUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/proposals")
public class ProposalController {

	private final ProposalService proposalService;
	private final SecurityUtil securityUtil;
	
	public ProposalController(ProposalService proposalService, SecurityUtil securityUtil) {
		super();
		this.proposalService = proposalService;
		this.securityUtil = securityUtil;
	}
	
    // POST: Submit a proposal (FREELANCER only)
    @PostMapping
    public ResponseEntity<ProposalResponseDTO> submitProposal(@Valid @RequestBody ProposalRequestDTO request){
    	if(!securityUtil.isFreelancer()) {
    		return ResponseEntity.status(403).body(null);
    	}
    	
    	Long freelancerId = securityUtil.getCurrentUserId();
    	ProposalResponseDTO response = proposalService.submitProposal(request, freelancerId);
    	return ResponseEntity.ok(response);
    }
    
    // GET: Get proposal by ID (Freelancer who submitted or Client who owns the job)
    @GetMapping("/{proposalId}")
    public ResponseEntity<ProposalResponseDTO> getProposalById(@PathVariable Long proposalId){
    	Long userId = securityUtil.getCurrentUserId();
    	ProposalResponseDTO proposal = proposalService.getProposalById(proposalId, userId);
    	return ResponseEntity.ok(proposal);
    }
    
 // Add these methods to ProposalController.java

 // GET: Get all proposals (ADMIN only or with proper permissions)
 @GetMapping
 public ResponseEntity<List<ProposalResponseDTO>> getAllProposals(
         @RequestParam(required = false) ProposalStatus status) {
     
     // Only admins or users with specific roles should access all proposals
     // For now, we'll allow access but you might want to add security checks
     
     List<ProposalResponseDTO> proposals;
     if (status != null) {
         proposals = proposalService.getProposalsByStatus(status);
     } else {
         proposals = proposalService.getAllProposals();
     }
     
     return ResponseEntity.ok(proposals);
 }

 // GET: Get proposals by status
 @GetMapping("/status/{status}")
 public ResponseEntity<List<ProposalResponseDTO>> getProposalsByStatus(
         @PathVariable ProposalStatus status) {
     
     List<ProposalResponseDTO> proposals = proposalService.getProposalsByStatus(status);
     return ResponseEntity.ok(proposals);
 }
    
    // GET: Get proposals for a specific job (CLIENT only, owner only)
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ProposalResponseDTO>> getProposalsForJob(@PathVariable Long jobId){
    	if(!securityUtil.isClient()) {
    		return ResponseEntity.status(403).body(null);
    	}
    	
    	Long clientId = securityUtil.getCurrentUserId();
    	List<ProposalResponseDTO> proposals = proposalService.getProposalsForJob(jobId, clientId);
    	return ResponseEntity.ok(proposals);
    }
    
    // GET: Get my proposals (FREELANCER only)
    @GetMapping("/my-proposals")
    public ResponseEntity<List<ProposalResponseDTO>> getMyProposals(){
    	if(!securityUtil.isFreelancer()) {
    		return ResponseEntity.status(403).body(null);
    	}
    	
    	Long freelancerId = securityUtil.getCurrentUserId();
    	List<ProposalResponseDTO> proposals = proposalService.getMyProposals(freelancerId);
    	return ResponseEntity.ok(proposals);
    }
    
    // PUT: Accept a proposal (CLIENT only, owner only)
    @PutMapping("/{proposalId}/accept")
    public ResponseEntity<ProposalResponseDTO> acceptProposal(
            @PathVariable Long proposalId,
            @RequestParam(required = false) String message) {
        
        if (!securityUtil.isClient()) {
            return ResponseEntity.status(403).body(null);
        }
        
        Long clientId = securityUtil.getCurrentUserId();
        ProposalResponseDTO response = proposalService.acceptProposal(proposalId, clientId, message);
        return ResponseEntity.ok(response);
    }
    
    // PUT: Reject a proposal (CLIENT only, owner only)
    @PutMapping("/{proposalId}/reject")
    public ResponseEntity<ProposalResponseDTO> rejectProposal(@PathVariable Long proposalId,
    		@RequestParam(required = false) String message){
    	
    	if(!securityUtil.isClient()) {
    		return ResponseEntity.status(403).body(null);
    	}
    	
    	Long clientId = securityUtil.getCurrentUserId();
    	ProposalResponseDTO response = proposalService.rejectProposal(proposalId, clientId, message);
    	return ResponseEntity.ok(response);
    }
    
    // PUT: Withdraw proposal (FREELANCER only, owner only)
    @PutMapping("/{proposalId}/withdraw")
    public ResponseEntity<ProposalResponseDTO> withdrawProposal(@PathVariable Long proposalId){
    	if(!securityUtil.isFreelancer()) {
    		return ResponseEntity.status(403).body(null);
    	}
    	
    	Long freelancerId = securityUtil.getCurrentUserId();
    	ProposalResponseDTO response = proposalService.withdrawProposal(proposalId, freelancerId);
    	return ResponseEntity.ok(response);
    }
}