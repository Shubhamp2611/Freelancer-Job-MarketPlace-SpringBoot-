package com.marketplace.contract;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContractMessageRepository extends JpaRepository<ContractMessage, Long>{
   List<ContractMessage> findByContractOrderBySentAtAsc(Contract contract);
   List<ContractMessage> findByContractAndIsReadFalse(Contract contract);
   Long countByContractAndIsReadFalse(Contract contract);
}
