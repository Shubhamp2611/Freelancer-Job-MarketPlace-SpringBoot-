package com.marketplace.job;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.marketplace.user.User;
import com.marketplace.user.UserRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class JobService {

	private final JobRepository jobRepository;
	private final UserRepository userRepository;
	
	public JobService(JobRepository jobRepository, UserRepository userRepository) {
		super();
		this.jobRepository = jobRepository;
		this.userRepository = userRepository;
	}
	
	// Create a new job
    public JobResponseDTO createJob(JobRequestDTO jobRequest, Long clientId) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Verify client has CLIENT role
        if (client.getRole() != com.marketplace.user.Role.CLIENT) {  // Use full path
            throw new RuntimeException("Only clients can post jobs");
        }
        
        Job job = new Job();
        job.setTitle(jobRequest.getTitle());
        job.setDescription(jobRequest.getDescription());
        job.setType(jobRequest.getType());
        job.setBudget(jobRequest.getBudget());
        job.setEstimatedDuration(jobRequest.getEstimatedDuration());
        job.setClient(client);
        job.setSkillsRequired(jobRequest.getSkillsRequired());
        job.setDeadline(jobRequest.getDeadline());
        
        Job savedJob = jobRepository.save(job);
        return convertToDTO(savedJob);
    }
	
	//get job by ID
	public JobResponseDTO getJobById(Long jobId) {
		Job job = jobRepository.findById(jobId).orElseThrow(()-> new RuntimeException("Job not found"));
		return convertToDTO(job);
	}
	
	// Add these methods to JobService.java

	// Get all jobs
	public List<JobResponseDTO> getAllJobs() {
	    List<Job> jobs = jobRepository.findAllByOrderByCreatedAtDesc();
	    return jobs.stream()
	            .map(this::convertToDTO)
	            .collect(Collectors.toList());
	}

	// Get jobs by status
	public List<JobResponseDTO> getJobsByStatus(JobStatus status) {
	    List<Job> jobs = jobRepository.findByStatusOrderByCreatedAtDesc(status);
	    return jobs.stream()
	            .map(this::convertToDTO)
	            .collect(Collectors.toList());
	}

	
	//Get all open jobs(for freelancers)
	public List<JobResponseDTO> getOpenJobs(){
		List<Job> jobs = jobRepository.findByStatusOrderByCreatedAtDesc(JobStatus.OPEN);
		
		return jobs.stream()
				.map(this::convertToDTO)
				.collect(Collectors.toList());
	}
	
	//get jobs by Client
	public List<JobResponseDTO> getJobsByClient(Long clientId){
		User client = userRepository.findById(clientId)
				.orElseThrow(() -> new RuntimeException("client not found"));
		
		List<Job> jobs = jobRepository.findByClient(client);
		return jobs.stream()
				.map(this::convertToDTO)
				.collect(Collectors.toList());
	}	
	
	//update job
	public JobResponseDTO updateJob(Long jobId, JobRequestDTO jobRequest, Long clientId){
		Job job = jobRepository.findById(jobId)
				.orElseThrow(() -> new RuntimeException("Job not found"));
		
		//verify clients owns the job
		if(!job.getClient().getId().equals(clientId)) {
			throw new RuntimeException("You can only update your own jobs");
		}
		
		//can only update if job is still open
		if(job.getStatus() != JobStatus.OPEN) {
			throw new RuntimeException("Cannot update job that is not OPEN");
		}
		
        job.setTitle(jobRequest.getTitle());
        job.setDescription(jobRequest.getDescription());
        job.setType(jobRequest.getType());
        job.setBudget(jobRequest.getBudget());
        job.setEstimatedDuration(jobRequest.getEstimatedDuration());
        job.setSkillsRequired(jobRequest.getSkillsRequired());
        job.setDeadline(jobRequest.getDeadline());
        
        Job updatedJob = jobRepository.save(job);
        return convertToDTO(updatedJob);
	}

	//Delete job (soft delete - chnange status
	public void deleteJob(Long jobId, Long clientId) {
		Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

		//verify client owns the job
		if(!job.getClient().getId().equals(clientId)) {
            throw new RuntimeException("You can only delete your own jobs");
		}
		
		job.setStatus(JobStatus.CANCELLED);
		jobRepository.save(job);
	}
	
	//Search jobs
	public Page<JobResponseDTO> searchJobs(String keyword, Pageable pageable){
		Page<Job> jobs = jobRepository.searchJobs(keyword, pageable);
		return jobs.map(this::convertToDTO);
	}
	
	private JobResponseDTO convertToDTO(Job job) {
		JobResponseDTO dto = new JobResponseDTO();
	       dto.setId(job.getId());
	        dto.setTitle(job.getTitle());
	        dto.setDescription(job.getDescription());
	        dto.setStatus(job.getStatus());
	        dto.setType(job.getType());
	        dto.setBudget(job.getBudget());
	        dto.setEstimatedDuration(job.getEstimatedDuration());
	        dto.setClientId(job.getClient().getId());
	        dto.setClientName(job.getClient().getName());
	        
	        if(job.getAssignedFreelancer() != null) {
	        	dto.setAssignedFreeLancerId(job.getAssignedFreelancer().getId());
	        }
	        
	        dto.setSkillsRequired(job.getSkillsRequired());
	        dto.setCreatedAt(job.getCreatedAt());
	        dto.setDeadline(job.getDeadline());
	        
	        return dto;
	}
}
