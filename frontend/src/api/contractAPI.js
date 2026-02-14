import axiosInstance from './axiosConfig';

export const contractAPI = {
  // Get contracts for current user - USE THE CORRECT ENDPOINT
  getMyContracts: () => axiosInstance.get('/contracts/my-contracts'),
  
  // Create contract
  createContract: (data) => 
    axiosInstance.post('/contracts', data),
  
  // Get contract by ID
  getContractById: (contractId) => 
    axiosInstance.get(`/contracts/${contractId}`),
  
  // Fund escrow - CORRECT THE ENDPOINT NAME
  fundEscrow: (contractId) => 
    axiosInstance.put(`/contracts/${contractId}/fund-escrow`),  // Changed from /fund to /fund-escrow
  
  // Complete contract - CORRECT THE ENDPOINT
  completeContract: (contractId, rating, review) => 
    axiosInstance.put(`/contracts/${contractId}/complete`, null, {  // Use query params
      params: { rating, review }
    }),
  
  // Get milestones
  getMilestones: (contractId) => 
    axiosInstance.get(`/contracts/${contractId}/milestones`),
  
  // Submit milestone - CORRECT THE ENDPOINT
  submitMilestone: (milestoneId, deliverables) =>
    axiosInstance.put(`/contracts/milestones/${milestoneId}/submit`, null, {
      params: { deliverables }
    }),
  
  // Approve milestone - CORRECT THE ENDPOINT
  approveMilestone: (milestoneId, feedback) =>
    axiosInstance.put(`/contracts/milestones/${milestoneId}/approve`, null, {
      params: { feedback }
    }),
  
  // Request revision - CORRECT THE ENDPOINT
  requestRevision: (milestoneId, feedback) =>
    axiosInstance.put(`/contracts/milestones/${milestoneId}/request-revision`, null, {
      params: { feedback }
    }),
  
  // Send message
  sendMessage: (contractId, message) =>
    axiosInstance.post(`/contracts/${contractId}/messages`, null, {
      params: { message }
    }),
  
  // Get messages
  getMessages: (contractId) =>
    axiosInstance.get(`/contracts/${contractId}/messages`),
  
  // Submit freelancer review
  submitReview: (contractId, rating, review) =>
    axiosInstance.put(`/contracts/${contractId}/review`, null, {
      params: { rating, review }
    }),
};