package com.marketplace.payment;

import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    
    private final PaymentService paymentService;
    
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
    
    @PostMapping("/escrow/{contractId}")
    public Map<String, Object> createEscrowPayment(@PathVariable Long contractId, 
                                                   @RequestParam Long clientId) {
        return paymentService.createEscrowPaymentIntent(contractId, clientId);
    }
    
    @PostMapping("/release/{contractId}")
    public Map<String, Object> releaseMilestone(@PathVariable Long contractId,
                                                @RequestParam Long milestoneId,
                                                @RequestParam Long clientId) {
        return paymentService.releaseMilestonePayment(contractId, milestoneId, clientId);
    }
    
    @GetMapping("/history/{userId}")
    public Map<String, Object> getPaymentHistory(@PathVariable Long userId) {
        return paymentService.getPaymentHistory(userId);
    }
    
    @PostMapping("/withdraw/{freelancerId}")
    public Map<String, Object> withdrawEarnings(@PathVariable Long freelancerId,
                                                @RequestParam BigDecimal amount) {
        return paymentService.withdrawEarnings(freelancerId, amount);
    }
}