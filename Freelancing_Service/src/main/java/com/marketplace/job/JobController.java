package com.marketplace.job;

import com.marketplace.security.SecurityUtil;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;
    private final SecurityUtil securityUtil;  // use securityUtil
    
    public JobController(JobService jobService, SecurityUtil securityUtil) {
		super();
		this.jobService = jobService;
		this.securityUtil = securityUtil;
	}
    
        @GetMapping
        public ResponseEntity<List<JobResponseDTO>> getAllJobs(
         @RequestParam(required = false) JobStatus status) {
     
           List<JobResponseDTO> jobs;
           if (status != null) {
         // Filter by status
              jobs = jobService.getJobsByStatus(status);
           } else {
           // Get all jobs
              jobs = jobService.getAllJobs();
           }
     
              return ResponseEntity.ok(jobs);
      }

 // GET: Get jobs by status
      @GetMapping("/status/{status}")
      public ResponseEntity<List<JobResponseDTO>> getJobsByStatus(@PathVariable JobStatus status) {
           List<JobResponseDTO> jobs = jobService.getJobsByStatus(status);
           return ResponseEntity.ok(jobs);
      }

	//POST: create a new job (Client only)
    @PostMapping
    public ResponseEntity<JobResponseDTO> createJob(@Valid @RequestBody JobRequestDTO jobRequest){
        Long clientId = securityUtil.getCurrentUserId();  // Use userService
        JobResponseDTO jobResponse = jobService.createJob(jobRequest, clientId);
        return ResponseEntity.ok(jobResponse);
    }
    
    //GET: get all open jobs(for freelancers)
    @GetMapping("/open")
    public ResponseEntity<List<JobResponseDTO>> getOpenJobs(){
        List<JobResponseDTO> jobs = jobService.getOpenJobs();
        return ResponseEntity.ok(jobs);
    }
    
    //GET: get job by Id
    @GetMapping("/{jobId}")
    public ResponseEntity<JobResponseDTO> getJobById(@PathVariable Long jobId){
        JobResponseDTO job = jobService.getJobById(jobId);
        return ResponseEntity.ok(job);
    }
    
    //GET: get my jobs(for client)
    @GetMapping("/my-jobs")
    public ResponseEntity<List<JobResponseDTO>> getMyJobs(){
        Long clientId = securityUtil.getCurrentUserId();  // Use userService
        List<JobResponseDTO> jobs = jobService.getJobsByClient(clientId);
        return ResponseEntity.ok(jobs);
    }
    
    //PUT: update job (CLIENT only, owner only)
    @PutMapping("/{jobId}")
    public ResponseEntity<JobResponseDTO> updateJob(@PathVariable Long jobId, @Valid @RequestBody JobRequestDTO jobRequest){
        Long clientId = securityUtil.getCurrentUserId();  // Use userService
        JobResponseDTO updatedJob = jobService.updateJob(jobId, jobRequest, clientId);
        return ResponseEntity.ok(updatedJob);
    }
    
    //DELETE: Delete job (CLIENT only,owner only)
    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long jobId){
        Long clientId = securityUtil.getCurrentUserId();  // Use userService
        jobService.deleteJob(jobId, clientId);
        return ResponseEntity.noContent().build();
    }
    
    //GET: Search Jobs
    @GetMapping("/search")
    public ResponseEntity<Page<JobResponseDTO>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction){
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("ASC") ? 
                Sort.Direction.ASC : Sort.Direction.DESC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        keyword = keyword != null ? keyword : "";
        Page<JobResponseDTO> jobs = jobService.searchJobs(keyword, pageable);
        return ResponseEntity.ok(jobs);
    }
}