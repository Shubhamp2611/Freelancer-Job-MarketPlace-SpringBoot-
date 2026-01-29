package com.marketplace.proposal;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.marketplace.contract.ContractResponseDTO;
import com.marketplace.contract.ContractService;
import com.marketplace.contract.CreateContractDTO;
import com.marketplace.job.Job;
import com.marketplace.job.JobRepository;
import com.marketplace.job.JobStatus;
import com.marketplace.user.User;
import com.marketplace.user.UserRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProposalService {

	private final ProposalRepository proposalRepository;
	private final JobRepository jobRepository;
	private final UserRepository userRepository;
	private final ContractService contractService;
	
	public ProposalService(ProposalRepository proposalRepository, JobRepository jobRepository,
			UserRepository userRepository, ContractService contractService) {
		super();
		this.proposalRepository = proposalRepository;
		this.jobRepository = jobRepository;
		this.userRepository = userRepository;
		this.contractService = contractService;
	}
	
	public ProposalResponseDTO submitProposal(ProposalRequestDTO request, Long freelancerId) {
		Job job = jobRepository.findById(request.getJobId())
				.orElseThrow(() -> new RuntimeException("Job not found"));
		
		User freelancer = userRepository.findById(freelancerId)
				.orElseThrow(() -> new RuntimeException("Freelancer not found"));
		
		//Verify freelancer role
		if(freelancer.getRole() != com.marketplace.user.Role.FREELANCER) {
			throw new RuntimeException("Only freelancers can sumbit proposals");
		}
		
		//check if job is open
		if(job.getStatus() != JobStatus.OPEN) {
            throw new RuntimeException("Cannot submit proposal for a closed job");
		}
		
		//check if already applied
		if(proposalRepository.findByJobAndFreelancer(job, freelancer).isPresent()) {
            throw new RuntimeException("You have already submitted a proposal for this job");
		}
		
		//check if job belongs to freelancer (can't apply to own job)
		if(job.getClient().getId().equals(freelancerId)) {
			throw new RuntimeException("You cannot submit a proposal to your own job");
		}
		
		Proposal proposal = new Proposal();
		proposal.setJob(job);
		proposal.setFreelancer(freelancer);
		proposal.setCoverLetter(request.getCoverLetter());
		proposal.setProposedPrice(request.getProposedPrice());
		proposal.setEstimatedDays(request.getEstimatedDays());
		
		Proposal savedProposal = proposalRepository.save(proposal);
		return convertToDTO(savedProposal);
	}
	
	//Get proposal by Id
	public ProposalResponseDTO getProposalById(Long proposalId, Long userId) {
		Proposal proposal = proposalRepository.findById(proposalId)
				.orElseThrow(() -> new RuntimeException("Proposal not found"));
		
		//check if user has permission (either freelancer who sumitted or client who owns the job)
		if(!proposal.getFreelancer().getId().equals(userId) &&
				!proposal.getJob().getClient().getId().equals(userId)) {
			throw new RuntimeException("You don't have permission to view this proposal");
		}
		
		return convertToDTO(proposal);
	}
	
	// Add these methods to ProposalService.java

	// Get all proposals
	public List<ProposalResponseDTO> getAllProposals() {
	    List<Proposal> proposals = proposalRepository.findAll();
	    return proposals.stream()
	            .map(this::convertToDTO)
	            .collect(Collectors.toList());
	}

	// Get proposals by status
	public List<ProposalResponseDTO> getProposalsByStatus(ProposalStatus status) {
	    List<Proposal> proposals = proposalRepository.findByStatus(status);
	    return proposals.stream()
	            .map(this::convertToDTO)
	            .collect(Collectors.toList());
	}
	
	//Get proposals for a job (client can view all proposals for their job)
	public List<ProposalResponseDTO> getProposalsForJob(Long jobId, Long clientId){
		Job job = jobRepository.findById(jobId)
				.orElseThrow(() -> new RuntimeException("Job not found"));
		
		//verify client owns the job
		if(!job.getClient().getId().equals(clientId)) {
			throw new RuntimeException("You can only view proposals for you own jobs");
		}
		
		List<Proposal> proposals = proposalRepository.findByJob(job);
		return proposals.stream()
				.map(this::convertToDTO)
				.collect(Collectors.toList());
	}
	
	//Get by proposals(for freelancer)
	public List<ProposalResponseDTO> getMyProposals(Long freelancerId){
		User freelancer = userRepository.findById(freelancerId)
				.orElseThrow(() -> new RuntimeException("Freelancer not found"));
		
		List<Proposal> proposals = proposalRepository.findByFreelancer(freelancer);
		return proposals.stream()
				.map(this::convertToDTO)
				.collect(Collectors.toList());
	}
	
	//Accept a proposal(Client action)
	public ProposalResponseDTO acceptProposal(Long proposalId, Long clientId, String message) {
		Proposal proposal = proposalRepository.findById(proposalId)
				.orElseThrow(() -> new RuntimeException("Proposal not found"));
		
		//Verify client owns the job
		if(!proposal.getJob().getClient().getId().equals(clientId)) {
			throw new RuntimeException("You can only accept proposal for your own jobs");
		}
		
		//Check if job is still open
		if(proposal.getJob().getStatus() != JobStatus.OPEN) {
		   throw new RuntimeException("Cannot accpet proposal for a closed job");
		}
		
		//Check if proposals is still pending
		if(proposal.getStatus() != ProposalStatus.PENDING) {
			throw new RuntimeException("This proposal is no longer available");
		}
		
		//Check if another proposal was already accepted for this job
		if (proposalRepository.findAcceptedProposalByJob(proposal.getJob()).isPresent()){            
			throw new RuntimeException("A proposal has already been accepted for this job");
        }
		
		//Update proposal status
		proposal.setStatus(ProposalStatus.ACCEPTED);
		proposal.setClientMessage(message);
		
		//Update Job status and assign freelancer
		Job job = proposal.getJob();
		job.setStatus(JobStatus.IN_PROGRESS);
		job.setAssignedFreelancer(proposal.getFreelancer());
		jobRepository.save(job);
		
		//Reject all other pending proposals for this job
		List<Proposal> otherProposals = proposalRepository.findByJobAndStatus(job, ProposalStatus.PENDING);
		for(Proposal other : otherProposals) {
			if(!other.getId().equals(proposalId)) {
				other.setStatus(ProposalStatus.REJECTED);
				other.setClientMessage("Another proposal was accepted for this job");
			}
		}
		
		proposalRepository.saveAll(otherProposals);
		Proposal savedProposal = proposalRepository.save(proposal);
		
		return convertToDTO(savedProposal);
	}
	
	//Reject a proposal(client action)
	public ProposalResponseDTO rejectProposal(Long proposalId, Long clientId, String message) {
		Proposal proposal = proposalRepository.findById(proposalId)
				.orElseThrow(() -> new RuntimeException("Proposal not found"));
		
		//Verify client owns the job
		if(!proposal.getJob().getClient().getId().equals(clientId)) {
			throw new RuntimeException("You can only reject proposals for your own jobs");
		}
		
		//Check if proposal is still pending
		if(proposal.getStatus() != ProposalStatus.PENDING) {
			throw new RuntimeException("This proposal is no longer availble");
		}
		
		proposal.setStatus(ProposalStatus.REJECTED);
		proposal.setClientMessage(message);
		
		Proposal savedProposal = proposalRepository.save(proposal);
		return convertToDTO(savedProposal);
	}
	
	//Withdraw proposal (freelancer action)
	public ProposalResponseDTO withdrawProposal(Long proposalId,Long freelancerId) {
		Proposal proposal =  proposalRepository.findById(proposalId)
				.orElseThrow(() -> new RuntimeException("Proposal not found"));
		
		//Verify freelancer owns the proposal
		if(!proposal.getFreelancer().getId().equals(freelancerId)) {
			throw new RuntimeException("You can only withdraw your own proposals");
		}
		
		//Check if proposal is still pending
		if(proposal.getStatus() != ProposalStatus.PENDING) {
			throw new RuntimeException("Connot withdraw a proposal that is already"+proposal.getStatus());
		}
		
		Proposal savedProposal = proposalRepository.save(proposal);
		return convertToDTO(savedProposal);
	}
	
	//Helper method to convert entity to DTO
	private ProposalResponseDTO convertToDTO(Proposal proposal) {
		ProposalResponseDTO dto = new ProposalResponseDTO();
		
		dto.setId(proposal.getId());
        dto.setJobId(proposal.getJob().getId());
        dto.setJobTitle(proposal.getJob().getTitle());
        dto.setFreelancerId(proposal.getFreelancer().getId());
        dto.setFreelancerName(proposal.getFreelancer().getName());
        dto.setFreelancerEmail(proposal.getFreelancer().getEmail());
        dto.setCoverLetter(proposal.getCoverLetter());
        dto.setProposedPrice(proposal.getProposedPrice());
        dto.setEstimatedDays(proposal.getEstimatedDays());
        dto.setStatus(proposal.getStatus());
        dto.setSubmittedAt(proposal.getSubmittedAt());
        dto.setRespondedAt(proposal.getRespondedAt());
        dto.setClientMessage(proposal.getClientMessage());
        dto.setJobBudget(proposal.getJob().getBudget());
		
        return dto;
	}	
	
	// In ProposalService.java, add this method:
	public ContractResponseDTO acceptProposalAndCreateContract(Long proposalId, Long clientId, 
	                                                          String message, CreateContractDTO contractRequest) {
	    // First accept the proposal (existing logic)
	    @SuppressWarnings("unused")
		ProposalResponseDTO acceptedProposal = acceptProposal(proposalId, clientId, message);
	    
	    // Then create contract
	    ContractResponseDTO contract = contractService.createContract(contractRequest, clientId);
	    
	    return contract;
	}

	public List<ProposalResponseDTO> getProposalsByFreelancer(String username) {

	    User freelancer = userRepository.findByEmail(username)
	            .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

	    // Verify role
	    if (freelancer.getRole() != com.marketplace.user.Role.FREELANCER) {
	        throw new RuntimeException("Only freelancers can view their proposals");
	    }

	    List<Proposal> proposals = proposalRepository.findByFreelancer(freelancer);

	    return proposals.stream()
	            .map(this::convertToDTO)
	            .collect(Collectors.toList());
	}

}
