package com.marketplace.contract;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.marketplace.user.User;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {

    // Find contracts by client
    List<Contract> findByClient(User client);
    
    // Find contracts by freelancer
    List<Contract> findByFreelancer(User freelancer);
    
    // Find contracts by proposal
    Optional<Contract> findByProposalId(Long proposalId);
    
    // Find contracts by status
    List<Contract> findByStatus(ContractStatus status);
    
    // Find contracts by client ID
    List<Contract> findByClientId(Long clientId);
    
    // Find contracts by freelancer ID
    List<Contract> findByFreelancerId(Long freelancerId);
    
    // Find active contracts for user(either client or freelancer)
    @Query("SELECT c FROM Contract c WHERE (c.client = :user OR c.freelancer = :user) AND c.status = 'ACTIVE'")
    List<Contract> findActiveContractsForUser(@Param("user") User user);
    
    // Find completed contracts
    @Query("SELECT c FROM Contract c WHERE (c.client = :user OR c.freelancer = :user) AND c.status = 'COMPLETED'")
    List<Contract> findCompletedContractsForUser(@Param("user") User user);
    
    // Count contracts by status for user
    @Query("SELECT COUNT(c) FROM Contract c WHERE (c.client = :user OR c.freelancer = :user) AND c.status = :status")
    Long countByUserAndStatus(@Param("user") User user, @Param("status") ContractStatus status);

    @Query("SELECT COUNT(c) FROM Contract c WHERE c.status = :status")
    Long countByStatus(@Param("status") ContractStatus status);

    @Query("SELECT COUNT(c) FROM Contract c WHERE c.createdAt >= :date")
    Long countByCreatedAtAfter(@Param("date") LocalDateTime date);
}