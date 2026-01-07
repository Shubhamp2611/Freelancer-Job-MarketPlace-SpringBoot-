package com.marketplace.job;

import java.util.List;
import java.util.stream.Collectors;

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
	
	//create a new job
	public JobResponseDTO createJob(JobRequestDTO jobRequest, Long clientId) {
		User client = userRepository.findById(clientId);
		
	//verify client has CLIENT role
		if(client.getRole().name().equals("CLIENT")) {
			throw new RuntimeException("Only Clients can post job");
		}
		
		Job job = new Job();
		job.setTitle(jobRequest.getTitle());
		job.setDescription(jobRequest.getDescription());
		job.setType(jobRequest.getType());
		job.setBudget(jobRequest.getBudget());
		job.setEstimatedDuration(jobRequest.getEstimatedDuration());
		job.setAssignedFreelancer(client);
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

	
	private JobResponseDTO convertToDTO(Job savedJob) {
		// TODO Auto-generated method stub
		return null;
	}
}
