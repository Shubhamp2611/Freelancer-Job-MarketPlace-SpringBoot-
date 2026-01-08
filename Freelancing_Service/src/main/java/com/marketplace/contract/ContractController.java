package com.marketplace.contract;

import java.util.List;

import org.springframework.http.ResponseEntity;
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
@RequestMapping("/api/contracts")
public class ContractController {

	private final ContractService contractService;
	private final SecurityUtil securityUtil;
	
	public ContractController(ContractService contractService, SecurityUtil securityUtil) {
		super();
		this.contractService = contractService;
		this.securityUtil = securityUtil;
	}
	
    // POST: Create contract from accepted proposal (CLIENT only)
	@PostMapping
	public ResponseEntity<ContractResponseDTO> createContract(@Valid @RequestBody CreateContractDTO request){
		if(!securityUtil.isClient()) {
			return ResponseEntity.status(403).build();
		}
		
		Long clientId = securityUtil.getCurrentUserId();
		ContractResponseDTO contract = contractService.createContract(request, clientId);
		
		return ResponseEntity.ok(contract);
	}
	
    // GET: Get contract by ID
    @GetMapping("/{contractId}")
    public ResponseEntity<ContractResponseDTO> getContractById(@PathVariable Long contractId){
    	Long userId = securityUtil.getCurrentUserId();
    	ContractResponseDTO contract = contractService.getContractById(contractId, userId);
    	return ResponseEntity.ok(contract);
    }
    
    // GET: Get my contracts
    @GetMapping("/my-contracts")
    public ResponseEntity<List<ContractResponseDTO>> getMyContract(){
    	Long userId = securityUtil.getCurrentUserId();
    	List<ContractResponseDTO> contracts = contractService.getActiveContracts(userId);
    	return ResponseEntity.ok(contracts);
    }
    
    // PUT: Fund escrow (CLIENT only)
    @PutMapping("/{contractId}/fund-escrow")
    public ResponseEntity<ContractResponseDTO> fundEscrow(@PathVariable Long contractId) {
        if (!securityUtil.isClient()) {
            return ResponseEntity.status(403).build();
        }
        
        Long clientId = securityUtil.getCurrentUserId();
        ContractResponseDTO contract = contractService.fundEscrow(contractId, clientId);
        return ResponseEntity.ok(contract);
    }
    
    // PUT: Submit milestone (FREELANCER only)
    @PutMapping("/milestones/{milestoneId}/submit")
    public ResponseEntity<ContractResponseDTO> submitMilestone(
            @PathVariable Long milestoneId,
            @RequestParam String deliverables) {
        
        if (!securityUtil.isFreelancer()) {
            return ResponseEntity.status(403).build();
        }
        
        Long freelancerId = securityUtil.getCurrentUserId();
        ContractResponseDTO contract = contractService.submitMilestone(milestoneId, freelancerId, deliverables);
        return ResponseEntity.ok(contract);
    }
    
    // PUT: Approve milestone (CLIENT only)
    @PutMapping("/milestones/{milestoneId}/approve")
    public ResponseEntity<ContractResponseDTO> approveMilestone(
            @PathVariable Long milestoneId,
            @RequestParam(required = false) String feedback) {
        
        if (!securityUtil.isClient()) {
            return ResponseEntity.status(403).build();
        }
        
        Long clientId = securityUtil.getCurrentUserId();
        ContractResponseDTO contract = contractService.approveMilestone(milestoneId, clientId, feedback);
        return ResponseEntity.ok(contract);
    }
    
    // PUT: Request revision (CLIENT only)
    @PutMapping("/milestones/{milestoneId}/request-revision")
    public ResponseEntity<ContractResponseDTO> requestRevision(
            @PathVariable Long milestoneId,
            @RequestParam String feedback) {
        
        if (!securityUtil.isClient()) {
            return ResponseEntity.status(403).build();
        }
        
        Long clientId = securityUtil.getCurrentUserId();
        ContractResponseDTO contract = contractService.requestRevision(milestoneId, clientId, feedback);
        return ResponseEntity.ok(contract);
    }
    
    // PUT: Complete contract (CLIENT only)
    @PutMapping("/{contractId}/complete")
    public ResponseEntity<ContractResponseDTO> completeContract(
            @PathVariable Long contractId,
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false) String review) {
        
        if (!securityUtil.isClient()) {
            return ResponseEntity.status(403).build();
        }
        
        Long clientId = securityUtil.getCurrentUserId();
        ContractResponseDTO contract = contractService.completeContract(contractId, clientId, rating, review);
        return ResponseEntity.ok(contract);
    }
    
    // PUT: Submit review (FREELANCER only)
    @PutMapping("/{contractId}/review")
    public ResponseEntity<ContractResponseDTO> submitReview(
            @PathVariable Long contractId,
            @RequestParam Integer rating,
            @RequestParam(required = false) String review) {
        
        if (!securityUtil.isFreelancer()) {
            return ResponseEntity.status(403).build();
        }
        
        Long freelancerId = securityUtil.getCurrentUserId();
        ContractResponseDTO contract = contractService.submitReview(contractId, freelancerId, rating, review);
        return ResponseEntity.ok(contract);
    }
    
    // POST: Send message
    @PostMapping("/{contractId}/messages")
    public ResponseEntity<Void> sendMessage(
            @PathVariable Long contractId,
            @RequestParam String message) {
        
        Long userId = securityUtil.getCurrentUserId();
        contractService.sendMessage(contractId, userId, message);
        return ResponseEntity.ok().build();
    }
    
    // GET: Get messages
    @GetMapping("/{contractId}/messages")
    public ResponseEntity<List<ContractMessage>> getMessages(@PathVariable Long contractId) {
        Long userId = securityUtil.getCurrentUserId();
        List<ContractMessage> messages = contractService.getMessages(contractId, userId);
        return ResponseEntity.ok(messages);
    }
}
