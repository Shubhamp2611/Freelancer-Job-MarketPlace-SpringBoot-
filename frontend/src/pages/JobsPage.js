import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Search, Add, Work, AccessTime, AttachMoney, Person, HowToVote } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../api/jobAPI';

const JobsPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    
    // Load initial jobs based on user role
    if (userData.role === 'FREELANCER') {
      fetchAvailableJobs();
    } else if (userData.role === 'CLIENT') {
      fetchMyJobs();
    } else {
      fetchAllJobs();
    }
  }, []);

  // Fetch available jobs for freelancers
  const fetchAvailableJobs = async () => {
    try {
      setLoading(true);
      setError('');
      
      // ✅ CORRECT: Use getAvailableJobs() which calls /jobs/open
      const response = await jobAPI.getAvailableJobs();
      setJobs(response.data || []);
      
    } catch (err) {
      console.error('Error fetching available jobs:', err);
      setError(err.response?.data?.message || 'Failed to load available jobs');
    } finally {
      setLoading(false);
    }
  };

  // Fetch my jobs for clients
  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await jobAPI.getMyJobs();
      setJobs(response.data || []);
      
    } catch (err) {
      console.error('Error fetching my jobs:', err);
      setError(err.response?.data?.message || 'Failed to load your jobs');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all jobs (for admin or unauthenticated users)
  const fetchAllJobs = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await jobAPI.getJobs('all');
      setJobs(response.data || []);
      
    } catch (err) {
      console.error('Error fetching all jobs:', err);
      setError(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    if (user?.role === 'FREELANCER') {
      // For freelancers: Tabs are "Available Jobs" and "Applied Jobs"
      if (newValue === 0) {
        fetchAvailableJobs();
      } else if (newValue === 1) {
        // TODO: Add fetch for freelancer's applied jobs
        // For now, show available jobs
        fetchAvailableJobs();
      }
    } else if (user?.role === 'CLIENT') {
      // For clients: Tabs are "Open Jobs" and "My Jobs"
      if (newValue === 0) {
        fetchAvailableJobs(); // Shows open jobs in marketplace
      } else if (newValue === 1) {
        fetchMyJobs(); // Shows client's own jobs
      }
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await jobAPI.searchJobs(searchTerm);
      setJobs(response.data || []);
      
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleApplyClick = (jobId, e) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/jobs/${jobId}/apply`);
  };

  // Determine tab labels based on user role
  const getTabLabels = () => {
    if (user?.role === 'FREELANCER') {
      return ['Available Jobs', 'Applied Jobs'];
    } else if (user?.role === 'CLIENT') {
      return ['Marketplace', 'My Jobs'];
    }
    return ['All Jobs', 'Featured'];
  };

  if (loading && jobs.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <CircularProgress />
          <Typography>Loading jobs...</Typography>
        </Box>
      </Container>
    );
  }

  const tabLabels = getTabLabels();
  const userRole = user?.role || 'GUEST';

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Box>
          <Typography variant="h4">
            {userRole === 'FREELANCER' ? 'Find Work' : 
             userRole === 'CLIENT' ? 'Hire Talent' : 
             'Browse Jobs'}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {userRole === 'FREELANCER' ? 'Apply to projects that match your skills' :
             userRole === 'CLIENT' ? 'Post jobs and find the right freelancer' :
             'Discover opportunities in our marketplace'}
          </Typography>
        </Box>
        
        {userRole === 'CLIENT' && (
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => navigate('/jobs/create')}
          >
            Post a Job
          </Button>
        )}
        
        {userRole === 'FREELANCER' && (
          <Button 
            variant="outlined"
            startIcon={<HowToVote />}
            onClick={() => navigate('/freelancer/proposals')}
          >
            My Proposals
          </Button>
        )}
      </Box>
      
      {/* Search and Tabs */}
      <Paper sx={{ p: 3, mb: 3 }}>
        {/* Search Bar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder={
              userRole === 'FREELANCER' ? 'Search jobs by title, skills, or description...' :
              userRole === 'CLIENT' ? 'Search for jobs in marketplace...' :
              'Search all jobs...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleSearch}
            disabled={loading}
          >
            Search
          </Button>
          <Button 
            variant="outlined"
            onClick={() => {
              setSearchTerm('');
              if (userRole === 'FREELANCER') fetchAvailableJobs();
              else if (userRole === 'CLIENT') fetchMyJobs();
            }}
          >
            Reset
          </Button>
        </Box>
        
        {/* Tabs */}
        {user && (
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
            {tabLabels.map((label, index) => (
              <Tab key={index} label={label} />
            ))}
          </Tabs>
        )}
      </Paper>
      
      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button size="small" onClick={
            userRole === 'FREELANCER' ? fetchAvailableJobs : 
            userRole === 'CLIENT' ? fetchMyJobs : 
            fetchAllJobs
          } sx={{ ml: 2 }}>
            Retry
          </Button>
        </Alert>
      )}
      
      {/* Job Listings */}
      {jobs.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {userRole === 'FREELANCER' && tabValue === 0 ? 'No available jobs found' :
             userRole === 'FREELANCER' && tabValue === 1 ? 'You have not applied to any jobs yet' :
             userRole === 'CLIENT' && tabValue === 0 ? 'No jobs in marketplace' :
             userRole === 'CLIENT' && tabValue === 1 ? 'You have not posted any jobs yet' :
             'No jobs found'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {userRole === 'FREELANCER' && tabValue === 0 ? 'Check back later for new opportunities!' :
             userRole === 'FREELANCER' && tabValue === 1 ? 'Browse available jobs and submit proposals' :
             userRole === 'CLIENT' && tabValue === 0 ? 'Be the first to post a job in the marketplace' :
             userRole === 'CLIENT' && tabValue === 1 ? 'Click "Post a Job" to create your first job posting' :
             'Try adjusting your search criteria'}
          </Typography>
          
          {userRole === 'CLIENT' && tabValue === 1 && (
            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={() => navigate('/jobs/create')}
              sx={{ mt: 2 }}
            >
              Post Your First Job
            </Button>
          )}
          
          {userRole === 'FREELANCER' && tabValue === 1 && jobs.length === 0 && (
            <Button 
              variant="contained" 
              onClick={() => {
                setTabValue(0);
                fetchAvailableJobs();
              }}
              sx={{ mt: 2 }}
            >
              Browse Available Jobs
            </Button>
          )}
        </Paper>
      ) : (
        <>
          {/* Results Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {tabLabels[tabValue]} ({jobs.length})
            </Typography>
            
            {userRole === 'FREELANCER' && tabValue === 0 && (
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => {
                  // Sort by newest
                  const sorted = [...jobs].sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                  );
                  setJobs(sorted);
                }}
              >
                Sort by Newest
              </Button>
            )}
          </Box>
          
          {/* Job Cards */}
          <Grid container spacing={3}>
            {jobs.map((job) => (
              <Grid item xs={12} key={job.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { 
                      boxShadow: 6,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s'
                    }
                  }}
                  onClick={() => handleJobClick(job.id)}
                >
                  <CardContent>
                    {/* Job Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {job.title}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                          <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Person fontSize="small" />
                            {job.clientName || 'Client'}
                          </Typography>
                          
                          {job.proposalCount > 0 && (
                            <Typography variant="caption" color="primary">
                              {job.proposalCount} proposal{job.proposalCount > 1 ? 's' : ''}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      
                      {/* Price and Actions */}
                      <Box sx={{ textAlign: 'right', minWidth: '120px' }}>
                        <Chip 
                          label={`$${job.budget}`} 
                          color="primary" 
                          icon={<AttachMoney />}
                          sx={{ mb: 1 }}
                        />
                        
                        {userRole === 'FREELANCER' && tabValue === 0 && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={(e) => handleApplyClick(job.id, e)}
                            sx={{ mt: 1 }}
                          >
                            Apply Now
                          </Button>
                        )}
                      </Box>
                    </Box>
                    
                    {/* Job Description */}
                    <Typography variant="body2" color="textSecondary" paragraph>
                      {job.description?.substring(0, 250) || 'No description provided'}...
                    </Typography>
                    
                    {/* Job Details */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip 
                        label={job.type || 'Project'} 
                        size="small" 
                        variant="outlined" 
                        icon={<Work fontSize="small" />}
                      />
                      <Chip 
                        icon={<AccessTime fontSize="small" />}
                        label={`${job.estimatedDuration || 'N/A'} days`} 
                        size="small" 
                        variant="outlined" 
                      />
                      <Chip 
                        label={job.status || 'OPEN'}
                        size="small"
                        color={
                          job.status === 'OPEN' ? 'success' :
                          job.status === 'IN_PROGRESS' ? 'warning' :
                          job.status === 'COMPLETED' ? 'primary' : 'default'
                        }
                      />
                    </Box>
                    
                    {/* Skills Required */}
                    {job.skillsRequired && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>
                          Skills Required:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {job.skillsRequired.split(',').map((skill, index) => (
                            <Chip 
                              key={index} 
                              label={skill.trim()} 
                              size="small" 
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                    
                    {/* Posted Date */}
                    <Typography variant="caption" color="textSecondary">
                      Posted: {new Date(job.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default JobsPage;