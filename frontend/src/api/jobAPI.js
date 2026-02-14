import axiosInstance from './axiosConfig';

export const jobAPI = {
  // ✅ For freelancers: Get available/open jobs
  getAvailableJobs: () => 
    axiosInstance.get('/jobs/open'),
  
  // ✅ For clients: Get my posted jobs
  getMyJobs: () => 
    axiosInstance.get('/jobs/my-jobs'),
  
  // ✅ Get all jobs (admin or browsing)
  getAllJobs: () => 
    axiosInstance.get('/jobs'),
  
  // ✅ Get job by ID
  getJobById: (id) => 
    axiosInstance.get(`/jobs/${id}`),
  
  // ✅ Create job (client only)
  createJob: (data) => 
    axiosInstance.post('/jobs', data),
  
  // ✅ Update job (client only)
  updateJob: (id, data) => 
    axiosInstance.put(`/jobs/${id}`, data),
  
  // ✅ Delete job (client only)
  deleteJob: (id) => 
    axiosInstance.delete(`/jobs/${id}`),
  
  // ✅ Search jobs
  searchJobs: (keyword, page = 0, size = 10) => 
    axiosInstance.get('/jobs/search', {
      params: { keyword, page, size }
    }),
  
  // ✅ Get jobs with filter (legacy support)
  getJobs: (filter = 'all') => {
    if (filter === 'open') {
      return axiosInstance.get('/jobs/open');
    } else if (filter === 'my-jobs') {
      return axiosInstance.get('/jobs/my-jobs');
    } else {
      return axiosInstance.get('/jobs');
    }
  },
};