import axiosInstance from './axiosConfig';

export const proposalAPI = {
  // Get all proposals (admin or for testing)
  getAllProposals: () => 
    axiosInstance.get('/proposals'),
  
  // Get proposals by status
  getProposalsByStatus: (status) => 
    axiosInstance.get(`/proposals/status/${status}`),
  
  // Submit proposal
  submitProposal: (data) => 
    axiosInstance.post('/proposals', data),
  
  // Get proposal by ID
  getProposalById: (proposalId) => 
    axiosInstance.get(`/proposals/${proposalId}`),
  
  // Get proposals for a job
  getProposalsForJob: (jobId) => 
    axiosInstance.get(`/proposals/job/${jobId}`),
  
  // Get my proposals
  getMyProposals: () => 
    axiosInstance.get('/proposals/my-proposals'),
  
  // Accept proposal
  acceptProposal: (proposalId, message) => 
    axiosInstance.put(`/proposals/${proposalId}/accept`, null, {
      params: { message }
    }),
  
  // Reject proposal
  rejectProposal: (proposalId, message) => 
    axiosInstance.put(`/proposals/${proposalId}/reject`, null, {
      params: { message }
    }),
  
  // Withdraw proposal
  withdrawProposal: (proposalId) => 
    axiosInstance.put(`/proposals/${proposalId}/withdraw`),
};