package com.marketplace.payment;

import com.marketplace.contract.Contract;
import com.marketplace.contract.ContractRepository;
import com.marketplace.user.User;
import com.marketplace.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final ContractRepository contractRepository;
    private final UserRepository userRepository;
    
    @Value("${stripe.secret-key}")
    private String stripeSecretKey;
    
    @Value("${stripe.public-key}")
    private String stripePublicKey;
    
    @Value("${platform.fee.percentage}")
    private int platformFeePercentage;
    
    @Value("${platform.currency}")
    private String platformCurrency;
    
    public PaymentService(PaymentRepository paymentRepository,
                         ContractRepository contractRepository,
                         UserRepository userRepository) {
        this.paymentRepository = paymentRepository;
        this.contractRepository = contractRepository;
        this.userRepository = userRepository;
    }
    
    // Create payment intent for escrow deposit
    public Map<String, Object> createEscrowPaymentIntent(Long contractId, Long clientId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        
        // Verify client owns the contract
        if (!contract.getClient().getId().equals(clientId)) {
            throw new RuntimeException("You can only pay for your own contracts");
        }
        
        // Check if already paid
        if (contract.getEscrowFunded()) {
            throw new RuntimeException("Escrow is already funded");
        }
        
        // Calculate platform fee
        BigDecimal platformFee = contract.getTotalAmount()
                .multiply(BigDecimal.valueOf(platformFeePercentage))
                .divide(BigDecimal.valueOf(100));
        
        // Create payment record
        Payment payment = new Payment();
        payment.setContract(contract);
        payment.setPayer(client);
        payment.setReceiver(contract.getFreelancer());
        payment.setAmount(contract.getTotalAmount());
        payment.setType(PaymentType.ESCROW_DEPOSIT);
        payment.setCurrency(platformCurrency);
        payment.setBillingName(client.getName());
        payment.setBillingEmail(client.getEmail());
        
        // Log Stripe keys (for debugging)
        System.out.println("Using Stripe Secret Key: " + stripeSecretKey.substring(0, Math.min(stripeSecretKey.length(), 10)) + "...");
        
        // In production, integrate with Stripe API
        // For now, simulate payment
        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setProcessedAt(LocalDateTime.now());
        payment.setCompletedAt(LocalDateTime.now());
        payment.setTransactionId("TXN_" + System.currentTimeMillis());
        payment.setGatewayName("Stripe");
        payment.setGatewayTransactionId("STRIPE_TXN_" + System.currentTimeMillis());
        
        Payment savedPayment = paymentRepository.save(payment);
        
        // Update contract
        contract.setEscrowFunded(true);
        contractRepository.save(contract);
        
        return Map.of(
            "paymentId", savedPayment.getId(),
            "amount", savedPayment.getAmount(),
            "status", savedPayment.getStatus(),
            "transactionId", savedPayment.getTransactionId(),
            "platformFee", platformFee,
            "platformCurrency", platformCurrency,
            "message", "Payment successful"
        );
    }
    
    // Release milestone payment to freelancer
    public Map<String, Object> releaseMilestonePayment(Long contractId, Long milestoneId, Long clientId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        
        // Verify client owns the contract
        if (!contract.getClient().getId().equals(clientId)) {
            throw new RuntimeException("Only the client can release payments");
        }
        
        // Check if escrow is funded
        if (!contract.getEscrowFunded()) {
            throw new RuntimeException("Escrow is not funded");
        }
        
        // In real implementation, check milestone status
        // For now, release 50% of escrow
        BigDecimal releaseAmount = contract.getTotalAmount().multiply(new BigDecimal("0.5"));
        
        // Create payment to freelancer
        Payment payment = new Payment();
        payment.setContract(contract);
        payment.setPayer(contract.getClient());
        payment.setReceiver(contract.getFreelancer());
        payment.setAmount(releaseAmount);
        payment.setType(PaymentType.MILESTONE_PAYMENT);
        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setTransactionId("MLS_TXN_" + System.currentTimeMillis());
        
        paymentRepository.save(payment);
        
        // Update contract payment tracking
        BigDecimal newPaidAmount = contract.getAmountPaidToFreelancer().add(releaseAmount);
        contract.setAmountPaidToFreelancer(newPaidAmount);
        contractRepository.save(contract);
        
        return Map.of(
            "releasedAmount", releaseAmount,
            "totalPaid", newPaidAmount,
            "remainingEscrow", contract.getAmountInEscrow(),
            "transactionId", payment.getTransactionId()
        );
    }
    
    // Get payment history for user
    public Map<String, Object> getPaymentHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Payment> sentPayments = paymentRepository.findByPayer(user);
        List<Payment> receivedPayments = paymentRepository.findByReceiver(user);
        
        BigDecimal totalEarnings = paymentRepository.getTotalEarnings(user);
        BigDecimal totalSpent = paymentRepository.getTotalSpent(user);
        
        return Map.of(
            "sentPayments", sentPayments,
            "receivedPayments", receivedPayments,
            "totalEarnings", totalEarnings != null ? totalEarnings : BigDecimal.ZERO,
            "totalSpent", totalSpent != null ? totalSpent : BigDecimal.ZERO,
            "balance", (totalEarnings != null ? totalEarnings : BigDecimal.ZERO)
                      .subtract(totalSpent != null ? totalSpent : BigDecimal.ZERO)
        );
    }
    
    // Withdraw earnings (for freelancers)
    public Map<String, Object> withdrawEarnings(Long freelancerId, BigDecimal amount) {
        User freelancer = userRepository.findById(freelancerId)
                .orElseThrow(() -> new RuntimeException("Freelancer not found"));
        
        BigDecimal totalEarnings = paymentRepository.getTotalEarnings(freelancer);
        
        // Get all withdrawals for this freelancer
        List<Payment> withdrawals = paymentRepository.findByReceiverAndType(freelancer, PaymentType.WITHDRAWAL);
        
        BigDecimal totalWithdrawn = withdrawals.stream()
                .filter(p -> p.getStatus() == PaymentStatus.COMPLETED)
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal availableBalance = totalEarnings != null ? totalEarnings : BigDecimal.ZERO;
        availableBalance = availableBalance.subtract(totalWithdrawn);
        
        if (amount.compareTo(availableBalance) > 0) {
            throw new RuntimeException("Insufficient balance. Available: " + availableBalance);
        }
        
        // Create withdrawal payment
        Payment withdrawal = new Payment();
        withdrawal.setPayer(freelancer); // Platform pays freelancer
        withdrawal.setReceiver(freelancer);
        withdrawal.setAmount(amount);
        withdrawal.setType(PaymentType.WITHDRAWAL);
        withdrawal.setStatus(PaymentStatus.PROCESSING);
        withdrawal.setTransactionId("WDL_TXN_" + System.currentTimeMillis());
        
        paymentRepository.save(withdrawal);
        
        return Map.of(
            "withdrawalId", withdrawal.getId(),
            "amount", amount,
            "availableBalance", availableBalance.subtract(amount),
            "platformCurrency", platformCurrency,
            "status", "Processing - Usually takes 3-5 business days"
        );
    }
    
    // Add platform fee payment
    public Payment createPlatformFeePayment(Contract contract) {
        BigDecimal platformFeeAmount = contract.getTotalAmount()
                .multiply(BigDecimal.valueOf(platformFeePercentage))
                .divide(BigDecimal.valueOf(100));
        
        Payment platformFee = new Payment();
        platformFee.setContract(contract);
        platformFee.setPayer(contract.getClient());
        platformFee.setReceiver(null); // Platform receives this
        platformFee.setAmount(platformFeeAmount);
        platformFee.setType(PaymentType.PLATFORM_FEE);
        platformFee.setStatus(PaymentStatus.COMPLETED);
        platformFee.setTransactionId("FEE_" + System.currentTimeMillis());
        platformFee.setCurrency(platformCurrency);
        
        return paymentRepository.save(platformFee);
    }
}