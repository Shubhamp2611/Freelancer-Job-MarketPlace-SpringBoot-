package com.marketplace.proposal;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.marketplace.job.Job;
import com.marketplace.user.User;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, Long>{

	//find proposals by job
	List<Proposal> findByJob(Job job);
	
	//Find proposals by freelancer
	List<Proposal> findByFreelancer(User freelancer);
	
	//Find proposals by job and freelancer (check if already applied)
	Optional<Proposal> findByJobAndFreelancer(Job job , User freelancer);
	
	//Find proposals by status
	List<Proposal> findByStatus(ProposalStatus status);
	
	//Find proposals for a specific job with status
    List<Proposal> findByJobAndStatus(Job job, ProposalStatus status);
	
	//Count proposals for a job
	long countByJob(Job job);
	
	//Find accepted proposal for a job (Should be only one)
	@Query("SELECT p FROM Proposal p WHERE p.job = :job AND p.status = 'ACCEPTED'")
    Optional<Proposal> findAcceptedProposalByJob(@Param("job") Job job);
    
    //Get proposals for freelancer with specific status
    List<Proposal> findByFreelancerAndStatus(User freelancer, ProposalStatus status);
    
    //Find all proposals for jobs posted by a specific client
    @Query("SELECT p FROM Proposal p WHERE p.job.client.id = :clientId")
    List<Proposal> findProposalsForClientJobs(@Param("clientId") Long clientId);
	
}
