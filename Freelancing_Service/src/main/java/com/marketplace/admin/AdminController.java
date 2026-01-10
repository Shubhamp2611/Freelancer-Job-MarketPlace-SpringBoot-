package com.marketplace.admin;

import com.marketplace.contract.ContractRepository;
import com.marketplace.job.JobRepository;
import com.marketplace.payment.PaymentRepository;
import com.marketplace.payment.PaymentType;
import com.marketplace.proposal.ProposalRepository;
import com.marketplace.user.UserRepository;
import com.marketplace.user.Role;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ProposalRepository proposalRepository;
    private final ContractRepository contractRepository;
    private final PaymentRepository paymentRepository;
    
    public AdminController(UserRepository userRepository,
                          JobRepository jobRepository,
                          ProposalRepository proposalRepository,
                          ContractRepository contractRepository,
                          PaymentRepository paymentRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.proposalRepository = proposalRepository;
        this.contractRepository = contractRepository;
        this.paymentRepository = paymentRepository;
    }
    
    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // User statistics
        stats.put("totalUsers", userRepository.count());
        stats.put("totalClients", userRepository.countByRole(Role.CLIENT));
        stats.put("totalFreelancers", userRepository.countByRole(Role.FREELANCER));
        stats.put("newUsersToday", userRepository.countByCreatedAtAfter(LocalDateTime.now().minusDays(1)));
        
        // Job statistics
        stats.put("totalJobs", jobRepository.count());
        stats.put("openJobs", jobRepository.count());
        stats.put("completedJobs", jobRepository.count());
        
        // Proposal statistics
        stats.put("totalProposals", proposalRepository.count());
        stats.put("acceptedProposals", proposalRepository.count());
        
        // Contract statistics
        stats.put("totalContracts", contractRepository.count());
        stats.put("activeContracts", contractRepository.count());
        stats.put("completedContracts", contractRepository.count());
        
        // Financial statistics
        BigDecimal totalRevenue = paymentRepository.getTotalPlatformRevenue();
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        stats.put("estimatedMonthlyRevenue", totalRevenue != null ? 
                 totalRevenue.multiply(new BigDecimal("1.2")) : BigDecimal.ZERO);
        
        // Recent activity (last 7 days)
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        stats.put("newJobsThisWeek", jobRepository.countByCreatedAtAfter(weekAgo) != null ? jobRepository.countByCreatedAtAfter(weekAgo) : 0L);
        stats.put("newContractsThisWeek", contractRepository.countByCreatedAtAfter(weekAgo) != null ? contractRepository.countByCreatedAtAfter(weekAgo) : 0L);
        stats.put("newPaymentsThisWeek", paymentRepository.countByCreatedAtAfter(weekAgo) != null ? paymentRepository.countByCreatedAtAfter(weekAgo) : 0L);
        
        return stats;
    }
    
    @GetMapping("/users")
    public Map<String, Object> getUserManagement() {
        Map<String, Object> data = new HashMap<>();
        data.put("users", userRepository.findAll());
        return data;
    }
    
    @GetMapping("/financials")
    public Map<String, Object> getFinancialReport() {
        Map<String, Object> report = new HashMap<>();
        
        // Payment breakdown by type
        report.put("escrowDeposits", paymentRepository.sumByType(PaymentType.ESCROW_DEPOSIT) != null ? paymentRepository.sumByType(PaymentType.ESCROW_DEPOSIT) : BigDecimal.ZERO);
        report.put("milestonePayments", paymentRepository.sumByType(PaymentType.MILESTONE_PAYMENT) != null ? paymentRepository.sumByType(PaymentType.MILESTONE_PAYMENT) : BigDecimal.ZERO);
        report.put("platformFees", paymentRepository.sumByType(PaymentType.PLATFORM_FEE) != null ? paymentRepository.sumByType(PaymentType.PLATFORM_FEE) : BigDecimal.ZERO);
        report.put("withdrawals", paymentRepository.sumByType(PaymentType.WITHDRAWAL) != null ? paymentRepository.sumByType(PaymentType.WITHDRAWAL) : BigDecimal.ZERO);
        
        // Monthly revenue
        report.put("revenueByMonth", paymentRepository.getRevenueByMonth());
        
        return report;
    }
}