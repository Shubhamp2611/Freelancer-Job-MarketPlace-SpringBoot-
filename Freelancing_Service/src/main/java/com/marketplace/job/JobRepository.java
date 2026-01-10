package com.marketplace.job;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.marketplace.user.User;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>{

	List<Job> findByClient(User client);
	
	List<Job> findByStatus(JobStatus status);
	
	List<Job> findByStatusOrderByCreatedAtDesc(JobStatus status);
	
	List<Job> findByAssignedFreelancer(User freelancer);
	
    // Search jobs by title or description
	@Query("SELECT j FROM Job j WHERE j.status = 'OPEN' AND "+
		    "(LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword,'%')) OR "+
		    "LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
		Page<Job> searchJobs(@Param("keyword") String keyword, Pageable pageable);
	
    // Find jobs by skills (comma-separated)
    @Query("SELECT j FROM Job j WHERE j.status = 'OPEN' AND " +
           "j.skillsRequired LIKE CONCAT('%', :skill, '%')")
    List<Job> findBySkill(@Param("skill") String skill);
    
    // Find jobs within budget range
    List<Job> findByStatusAndBudgetBetween(JobStatus status, BigDecimal minBudget, BigDecimal maxBudget);

    @Query("SELECT COUNT(j) FROM Job j WHERE j.status = :status")
    Long countByStatus(@Param("status") JobStatus status);

    @Query("SELECT COUNT(j) FROM Job j WHERE j.createdAt >= :date")
    Long countByCreatedAtAfter(@Param("date") LocalDateTime date);
    
 // In JobRepository.java
    @Query("SELECT COUNT(j) FROM Job j WHERE j.status = 'OPEN'")
    Long countOpenJobs();

    @Query("SELECT COUNT(j) FROM Job j WHERE j.status = 'COMPLETED'")
    Long countCompletedJobs();

    // In ProposalRepository.java
    @Query("SELECT COUNT(p) FROM Proposal p WHERE p.status = 'ACCEPTED'")
    Long countAcceptedProposals();

    // In ContractRepository.java
    @Query("SELECT COUNT(c) FROM Contract c WHERE c.status = 'ACTIVE'")
    Long countActiveContracts();

    @Query("SELECT COUNT(c) FROM Contract c WHERE c.status = 'COMPLETED'")
    Long countCompletedContracts();
}
