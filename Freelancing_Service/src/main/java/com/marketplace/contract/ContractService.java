package com.marketplace.contract;

import com.marketplace.job.Job;
import com.marketplace.job.JobRepository;
import com.marketplace.job.JobStatus;
import com.marketplace.proposal.Proposal;
import com.marketplace.proposal.ProposalRepository;
import com.marketplace.proposal.ProposalStatus;
import com.marketplace.user.User;
import com.marketplace.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ContractService {
    
    private final ContractRepository contractRepository;
    private final MilestoneRepository milestoneRepository;
    private final ProposalRepository proposalRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ContractMessageRepository messageRepository;
    
    public ContractService(ContractRepository contractRepository,
                          MilestoneRepository milestoneRepository,
                          ProposalRepository proposalRepository,
                          JobRepository jobRepository,
                          UserRepository userRepository,
                          ContractMessageRepository messageRepository) {
        this.contractRepository = contractRepository;
        this.milestoneRepository = milestoneRepository;
        this.proposalRepository = proposalRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
    }
    
    // Create contract from accepted proposal
    public ContractResponseDTO createContract(CreateContractDTO request, Long clientId) {
        Proposal proposal = proposalRepository.findById(request.getProposalId())
                .orElseThrow(() -> new RuntimeException("Proposal not found"));
        
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        
        // Verify client owns the proposal
        if (!proposal.getJob().getClient().getId().equals(clientId)) {
            throw new RuntimeException("You can only create contracts from your own job proposals");
        }
        
        // Verify proposal is accepted
        if (proposal.getStatus() != ProposalStatus.ACCEPTED) {
            throw new RuntimeException("Cannot create contract from a non-accepted proposal");
        }
        
        // Check if contract already exists for this proposal
        if (contractRepository.findByProposalId(proposal.getId()).isPresent()) {
            throw new RuntimeException("Contract already exists for this proposal");
        }
        
        // Create contract
        Contract contract = new Contract();
        contract.setProposal(proposal);
        contract.setClient(client);
        contract.setFreelancer(proposal.getFreelancer());
        contract.setJob(proposal.getJob());
        contract.setTitle(request.getTitle());
        contract.setDescription(request.getDescription());
        contract.setTotalAmount(proposal.getProposedPrice());
        contract.setStartDate(request.getStartDate());
        contract.setDueDate(request.getDueDate());
        contract.setStatus(ContractStatus.ACTIVE);
        
        Contract savedContract = contractRepository.save(contract);
        
        // Create milestones if provided
        if (request.getMilestones() != null && !request.getMilestones().isEmpty()) {
            createMilestones(savedContract, request.getMilestones());
        } else {
            // Create a single milestone for the full amount
            createDefaultMilestone(savedContract);
        }
        
        // Create system message
        createSystemMessage(savedContract, "Contract created. Awaiting escrow funding.");
        
        return convertToDTO(savedContract);
    }
    
    // Get contract by ID
    public ContractResponseDTO getContractById(Long contractId, Long userId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        
        // Verify user is part of the contract
        if (!contract.getClient().getId().equals(userId) && 
            !contract.getFreelancer().getId().equals(userId)) {
            throw new RuntimeException("You don't have permission to view this contract");
        }
        
        return convertToDTO(contract);
    }
    
    // Get contracts for current user
    public List<ContractResponseDTO> getMyContracts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Contract> contracts = contractRepository.findByClient(user);
        contracts.addAll(contractRepository.findByFreelancer(user));
        
        return contracts.stream()
                .distinct()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get active contracts
    public List<ContractResponseDTO> getActiveContracts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Contract> contracts = contractRepository.findActiveContractsForUser(user);
        return contracts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Fund escrow (client action)
    public ContractResponseDTO fundEscrow(Long contractId, Long clientId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        
        // Verify client owns the contract
        if (!contract.getClient().getId().equals(clientId)) {
            throw new RuntimeException("Only the client can fund the escrow");
        }
        
        // Check if already funded
        if (contract.getEscrowFunded()) {
            throw new RuntimeException("Escrow is already funded");
        }
        
        // Check contract status
        if (contract.getStatus() != ContractStatus.ACTIVE) {
            throw new RuntimeException("Cannot fund escrow for a non-active contract");
        }
        
        // In real implementation, integrate with payment gateway
        // For now, just mark as funded
        contract.setEscrowFunded(true);
        contract.setAmountInEscrow(contract.getTotalAmount()); // ADD THIS LINE
        
        Contract savedContract = contractRepository.save(contract);
        
        // Create system messages
        createSystemMessage(savedContract, "Escrow funded by client. Work can begin.");
        createSystemMessage(savedContract, "Funds: $" + savedContract.getTotalAmount() + 
                              " (Freelancer earnings: $" + savedContract.getFreelancerEarnings() + 
                              ", Platform fee: $" + savedContract.getPlatformFee() + ")");
        
        List<Milestone> milestones = milestoneRepository.findByContractOrderBySequenceAsc(contract);
        if (!milestones.isEmpty()) {
            Milestone firstMilestone = milestones.get(0);
            firstMilestone.setStatus(MilestoneStatus.IN_PROGRESS);
            milestoneRepository.save(firstMilestone);
        }
        
        return convertToDTO(savedContract);
    }
    
    // Submit milestone for review (freelancer action)
    public ContractResponseDTO submitMilestone(Long milestoneId, Long freelancerId, String deliverables) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));
        
        Contract contract = milestone.getContract();
        
        // Verify freelancer owns the contract
        if (!contract.getFreelancer().getId().equals(freelancerId)) {
            throw new RuntimeException("Only the freelancer can submit milestones");
        }
        
        // Check milestone status
        if (milestone.getStatus() != MilestoneStatus.IN_PROGRESS) {
            throw new RuntimeException("Milestone is not in progress");
        }
        
        milestone.setStatus(MilestoneStatus.SUBMITTED);
        milestone.setDeliverables(deliverables);
        
        milestoneRepository.save(milestone);
        
        // Create system message
        createSystemMessage(contract, "Milestone submitted: " + milestone.getTitle() + 
                              " ($" + milestone.getAmount() + ")");
        
        return convertToDTO(contract);
    }
    
    // Approve milestone (client action)
    public ContractResponseDTO approveMilestone(Long milestoneId, Long clientId, String feedback) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));
        
        Contract contract = milestone.getContract();
        
        // Verify client owns the contract
        if (!contract.getClient().getId().equals(clientId)) {
            throw new RuntimeException("Only the client can approve milestones");
        }
        
        // Check milestone status
        if (milestone.getStatus() != MilestoneStatus.SUBMITTED) {
            throw new RuntimeException("Milestone is not submitted for review");
        }
        
        milestone.setStatus(MilestoneStatus.APPROVED);
        milestone.setClientFeedback(feedback);
        
        // FIX 1: Calculate with platform fee deduction
        BigDecimal platformFee = milestone.getAmount().multiply(new BigDecimal("0.10"));
        BigDecimal freelancerAmount = milestone.getAmount().subtract(platformFee);
        
        BigDecimal newPaidAmount = contract.getAmountPaidToFreelancer().add(freelancerAmount);
        BigDecimal newEscrowAmount = contract.getAmountInEscrow().subtract(milestone.getAmount());
        
        contract.setAmountPaidToFreelancer(newPaidAmount);
        contract.setAmountInEscrow(newEscrowAmount);
        
        milestoneRepository.save(milestone);
        Contract savedContract = contractRepository.save(contract);
        
        // FIX 3: Start next milestone automatically
        List<Milestone> allMilestones = milestoneRepository.findByContractOrderBySequenceAsc(contract);
        for (int i = 0; i < allMilestones.size(); i++) {
            if (allMilestones.get(i).getId().equals(milestoneId) && i + 1 < allMilestones.size()) {
                Milestone nextMilestone = allMilestones.get(i + 1);
                if (nextMilestone.getStatus() == MilestoneStatus.PENDING) {
                    nextMilestone.setStatus(MilestoneStatus.IN_PROGRESS);
                    milestoneRepository.save(nextMilestone);
                }
                break;
            }
        }
        
        createSystemMessage(savedContract, "Milestone approved: " + milestone.getTitle() + 
                              " ($" + freelancerAmount + " released to freelancer, $" + 
                              platformFee + " platform fee)");
        
        return convertToDTO(savedContract);
    }
    
    // Request revision (client action)
    public ContractResponseDTO requestRevision(Long milestoneId, Long clientId, String feedback) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));
        
        Contract contract = milestone.getContract();
        
        // Verify client owns the contract
        if (!contract.getClient().getId().equals(clientId)) {
            throw new RuntimeException("Only the client can request revisions");
        }
        
        milestone.setStatus(MilestoneStatus.REVISION_REQUESTED);
        milestone.setClientFeedback(feedback);
        
        milestoneRepository.save(milestone);
        
        createSystemMessage(contract, "Revision requested for milestone: " + milestone.getTitle());
        
        return convertToDTO(contract);
    }
    
    // Complete contract (client action)
    public ContractResponseDTO completeContract(Long contractId, Long clientId, 
                                                Integer rating, String review) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        
        // Verify client owns the contract
        if (!contract.getClient().getId().equals(clientId)) {
            throw new RuntimeException("Only the client can complete the contract");
        }
        
     // Check if all milestones are completed
        List<Milestone> milestones = milestoneRepository.findByContract(contract);
        boolean allMilestonesCompleted = milestones.stream()
                .allMatch(m -> m.getStatus() == MilestoneStatus.PAID || 
                              m.getStatus() == MilestoneStatus.COMPLETED ||
                              m.getStatus() == MilestoneStatus.APPROVED); // ADD THIS
        
        if (!allMilestonesCompleted) {
            throw new RuntimeException("Cannot complete contract with pending milestones");
        }
        
        contract.setStatus(ContractStatus.COMPLETED);
        contract.setCompletedAt(LocalDateTime.now());
        contract.setClientRating(rating);
        contract.setClientReview(review);
        
        // Update job status
        Job job = contract.getJob();
        job.setStatus(JobStatus.COMPLETED);
        jobRepository.save(job);
        
        Contract savedContract = contractRepository.save(contract);
        
        createSystemMessage(savedContract, "Contract completed successfully!");
        
        return convertToDTO(savedContract);
    }
    
    
    
    // Submit review (freelancer action)
    public ContractResponseDTO submitReview(Long contractId, Long freelancerId, 
                                            Integer rating, String review) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        
        // Verify freelancer owns the contract
        if (!contract.getFreelancer().getId().equals(freelancerId)) {
            throw new RuntimeException("Only the freelancer can submit review");
        }
        
        contract.setFreelancerRating(rating);
        contract.setFreelancerReview(review);
        
        Contract savedContract = contractRepository.save(contract);
        
        return convertToDTO(savedContract);
    }
    
    // Send message in contract
    public void sendMessage(Long contractId, Long userId, String message) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Verify user is part of the contract
        if (!contract.getClient().getId().equals(userId) && 
            !contract.getFreelancer().getId().equals(userId)) {
            throw new RuntimeException("You cannot send messages in this contract");
        }
        
        ContractMessage contractMessage = new ContractMessage();
        contractMessage.setContract(contract);
        contractMessage.setSender(user);
        contractMessage.setMessage(message);
        
        messageRepository.save(contractMessage);
    }
    
    // Get contract messages
    public List<ContractMessage> getMessages(Long contractId, Long userId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        
        // Verify user is part of the contract
        if (!contract.getClient().getId().equals(userId) && 
            !contract.getFreelancer().getId().equals(userId)) {
            throw new RuntimeException("You cannot view messages for this contract");
        }
        
        return messageRepository.findByContractOrderBySendAtAsc(contract);
    }
    
    // Helper methods
    private void createMilestones(Contract contract, List<MilestoneRequestDTO> milestoneRequests) {
        BigDecimal total = BigDecimal.ZERO;
        
        for (MilestoneRequestDTO request : milestoneRequests) {
            Milestone milestone = new Milestone();
            milestone.setContract(contract);
            milestone.setTitle(request.getTitle());
            milestone.setDescription(request.getDescription());
            milestone.setAmount(request.getAmount());
            milestone.setDueDate(request.getDueDate());
            milestone.setDeliverables(request.getDeliverable());
            milestone.setSequence(request.getSequence());
            milestone.setStatus(MilestoneStatus.PENDING);
            
            milestoneRepository.save(milestone);
            total = total.add(request.getAmount());
        }
        
        // Verify milestone total equals contract total
        if (total.compareTo(contract.getTotalAmount()) != 0) {
            throw new RuntimeException("Milestone total must equal contract total");
        }
    }
    
    private void createDefaultMilestone(Contract contract) {
        Milestone milestone = new Milestone();
        milestone.setContract(contract);
        milestone.setTitle("Complete Project");
        milestone.setDescription("Complete all project deliverables");
        milestone.setAmount(contract.getTotalAmount());
        milestone.setDueDate(contract.getDueDate());
        milestone.setSequence(1);
        milestone.setStatus(MilestoneStatus.PENDING);
        
        milestoneRepository.save(milestone);
    }
    
    private void createSystemMessage(Contract contract, String message) {
        try {
            ContractMessage systemMessage = new ContractMessage();
            systemMessage.setContract(contract);
            systemMessage.setMessage(message);
            systemMessage.setType(MessageType.SYSTEM);
            
            // ALWAYS set a sender - use contract client
            systemMessage.setSender(contract.getClient());
            
            messageRepository.save(systemMessage);
        } catch (Exception e) {
            // If system message fails, just log it but don't break the main flow
            System.out.println("System message failed (non-critical): " + e.getMessage());
        }
    }
    
 // Add to ContractService class
    public List<MilestoneResponseDTO> getMilestones(Long contractId, Long userId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        
        // Verify user is part of the contract
        if (!contract.getClient().getId().equals(userId) && 
            !contract.getFreelancer().getId().equals(userId)) {
            throw new RuntimeException("You don't have permission to view milestones");
        }
        
        List<Milestone> milestones = milestoneRepository.findByContractOrderBySequenceAsc(contract);
        
        return milestones.stream()
                .map(this::convertMilestoneToDTO)
                .collect(Collectors.toList());
    }

    private MilestoneResponseDTO convertMilestoneToDTO(Milestone milestone) {
        MilestoneResponseDTO dto = new MilestoneResponseDTO();
        dto.setId(milestone.getId());
        dto.setTitle(milestone.getTitle());
        dto.setDescription(milestone.getDescription());
        dto.setAmount(milestone.getAmount());
        dto.setStatus(milestone.getStatus());
        dto.setDueDate(milestone.getDueDate());
        dto.setCompletedAt(milestone.getCompletedAt());
        dto.setPaidAt(milestone.getPaidAt());
        dto.setDeliverables(milestone.getDeliverables());
        dto.setClientFeedback(milestone.getClientFeedback());
        dto.setSequence(milestone.getSequence());
        
        return dto;
    }
    
    private ContractResponseDTO convertToDTO(Contract contract) {
        ContractResponseDTO dto = new ContractResponseDTO();
        dto.setId(contract.getId());
        dto.setProposalId(contract.getProposal().getId());
        dto.setJobId(contract.getJob().getId());
        dto.setJobTitle(contract.getJob().getTitle());
        dto.setClientId(contract.getClient().getId());
        dto.setClientName(contract.getClient().getName());
        dto.setFreelancerId(contract.getFreelancer().getId());
        dto.setFreelancerName(contract.getFreelancer().getName());
        dto.setTitle(contract.getTitle());
        dto.setDescription(contract.getDescription());
        dto.setStatus(contract.getStatus());
        dto.setTotalAmount(contract.getTotalAmount());
        dto.setPlatformFee(contract.getPlatformFee());
        dto.setFreelancerEarnings(contract.getFreelancerEarnings());
        dto.setStartDate(contract.getStartDate());
        dto.setEndDate(contract.getEndDate());
        dto.setDeadline(contract.getDueDate());
        dto.setCreatedAt(contract.getCreatedAt());
        dto.setEscrowFunded(contract.getEscrowFunded());
        dto.setAmountPaidToFreelancer(contract.getAmountPaidToFreelancer());
        dto.setAmountInEscrow(contract.getAmountInEscrow());
        dto.setClientRating(contract.getClientRating());
        dto.setFreelancerRating(contract.getFreelancerRating());
        dto.setClientReview(contract.getClientReview());
        dto.setFreelancerReview(contract.getFreelancerReview());
        
        return dto;
    }
}