package com.marketplace.contract;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, Long>{
	List<Milestone> findByContract(Contract contract);
	List<Milestone> findByContractAndStatus(Contract contract, MilestoneStatus status);
	List<Milestone> findByContractOrderBySequenceAsc(Contract contract);
}
