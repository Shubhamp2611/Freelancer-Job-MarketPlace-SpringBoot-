package com.marketplace.payment;

import com.marketplace.contract.Contract;
import com.marketplace.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByPayer(User payer);
    List<Payment> findByReceiver(User receiver);
    List<Payment> findByContract(Contract contract);
    List<Payment> findByStatus(PaymentStatus status);
    List<Payment> findByType(PaymentType type);
    List<Payment> findByReceiverAndType(User receiver, PaymentType type);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.receiver = :user AND p.status = 'COMPLETED'")
    BigDecimal getTotalEarnings(@Param("user") User user);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.payer = :user AND p.status = 'COMPLETED'")
    BigDecimal getTotalSpent(@Param("user") User user);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.type = 'PLATFORM_FEE' AND p.status = 'COMPLETED'")
    BigDecimal getTotalPlatformRevenue();
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.createdAt >= :date")
    Long countByCreatedAtAfter(@Param("date") LocalDateTime date);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.type = :type AND p.status = 'COMPLETED'")
    BigDecimal sumByType(@Param("type") PaymentType type);
    
    @Query("SELECT MONTH(p.createdAt) as month, SUM(p.amount) as revenue " +
           "FROM Payment p WHERE p.type = 'PLATFORM_FEE' AND p.status = 'COMPLETED' " +
           "GROUP BY MONTH(p.createdAt)")
    List<Object[]> getRevenueByMonth();
}