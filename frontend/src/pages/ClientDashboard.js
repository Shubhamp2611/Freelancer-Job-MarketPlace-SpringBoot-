import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Work,
  Description,
  AttachMoney,
  People,
  TrendingUp,
  Notifications,
  FilterList,
  ArrowForward,
  Schedule,
  MoreVert,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../api/jobAPI';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalJobs: 0,
    pendingProposals: 0,
    activeContracts: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentJobs, setRecentJobs] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch client's jobs
      const response = await jobAPI.getJobs('my-jobs');
      const jobs = response.data || [];
      
      const activeJobs = jobs.filter(job => job.status === 'OPEN').length;
      
      setStats({
        activeJobs,
        totalJobs: jobs.length,
        pendingProposals: Math.floor(Math.random() * 15) + 5,
        activeContracts: Math.floor(Math.random() * 5) + 1,
        totalSpent: 45800,
      });
      
      setRecentJobs(jobs.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      OPEN: { bg: '#10b98115', color: '#10b981', label: 'Open' },
      IN_PROGRESS: { bg: '#f59e0b15', color: '#f59e0b', label: 'In Progress' },
      COMPLETED: { bg: '#6366f115', color: '#6366f1', label: 'Completed' },
      CLOSED: { bg: '#6b728015', color: '#6b7280', label: 'Closed' },
    };
    return colors[status] || colors.OPEN;
  };

  const StatCard = ({ icon, value, label, color, subtitle }) => (
    <Paper
      sx={{
        p: 3,
        height: '100%',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}30`,
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1, fontSize: 80 }}>
        {icon}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {React.cloneElement(icon, { sx: { fontSize: 32, color } })}
      </Box>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
        {label}
      </Typography>
      {subtitle && (
        <Typography variant="caption" sx={{ color, fontWeight: 600, mt: 1, display: 'block' }}>
          {subtitle}
        </Typography>
      )}
    </Paper>
  );

  const JobCard = ({ job }) => {
    const statusInfo = getStatusColor(job.status);
    
    return (
      <Card
        sx={{
          cursor: 'pointer',
          borderRadius: 3,
          border: '1px solid #e5e7eb',
          mb: 2,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            borderColor: '#6366f1',
            transform: 'translateX(4px)',
          },
        }}
        onClick={() => navigate(`/jobs/${job.id}`)}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {job.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={statusInfo.label}
                  size="small"
                  sx={{ bgcolor: statusInfo.bg, color: statusInfo.color, fontWeight: 600 }}
                />
                <Chip
                  label={job.type}
                  size="small"
                  variant="outlined"
                  sx={{ borderColor: '#e5e7eb', fontWeight: 500 }}
                />
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#6366f1', mb: 0.5 }}>
                ${job.budget?.toLocaleString() || '0'}
              </Typography>
              <IconButton size="small">
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {job.description}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px solid #e5e7eb' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <People sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {Math.floor(Math.random() * 20) + 5} proposals
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {new Date(job.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
            <Button
              endIcon={<ArrowForward />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: '#6366f1',
              }}
            >
              View Details
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={48} />
          <Typography sx={{ mt: 2 }}>Loading your dashboard...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f9fafb', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Welcome back, {user?.name || 'Client'}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your projects and find the perfect talent
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton
                sx={{
                  bgcolor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  '&:hover': { bgcolor: '#f9fafb' },
                }}
              >
                <Notifications />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/jobs/create')}
              sx={{
                background: 'linear-gradient(45deg, #10b981, #059669)',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #059669, #047857)',
                },
              }}
            >
              Post New Job
            </Button>
          </Box>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<Work />}
              value={stats.activeJobs}
              label="Active Jobs"
              color="#10b981"
              subtitle="Receiving proposals"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<Description />}
              value={stats.totalJobs}
              label="Total Jobs Posted"
              color="#6366f1"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<People />}
              value={stats.pendingProposals}
              label="Pending Proposals"
              color="#f59e0b"
              subtitle="Awaiting review"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<AttachMoney />}
              value={`$${stats.totalSpent.toLocaleString()}`}
              label="Total Spent"
              color="#8b5cf6"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Recent Jobs */}
          <Grid item xs={12} lg={8}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid #e5e7eb',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Your Recent Jobs
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Track and manage your job postings
                  </Typography>
                </Box>
                <IconButton>
                  <FilterList />
                </IconButton>
              </Box>

              {recentJobs.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No jobs posted yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Create your first job posting to get started
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/jobs/create')}
                    sx={{
                      background: 'linear-gradient(45deg, #10b981, #059669)',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 4,
                      borderRadius: 3,
                    }}
                  >
                    Post Your First Job
                  </Button>
                </Box>
              ) : (
                <>
                  {recentJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </>
              )}

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/jobs')}
                sx={{
                  mt: 2,
                  borderRadius: 3,
                  borderColor: '#e5e7eb',
                  color: 'text.primary',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { borderColor: '#6366f1', bgcolor: '#6366f105' },
                }}
              >
                View All Jobs
              </Button>
            </Paper>
          </Grid>

          {/* Right Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Activity Summary */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid #e5e7eb' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Activity Summary
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: '#f9fafb',
                    borderRadius: 3,
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Avatar sx={{ bgcolor: '#10b98115', color: '#10b981', width: 40, height: 40 }}>
                      <Work />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        New Proposals Received
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        15 new proposals today
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    bgcolor: '#f9fafb',
                    borderRadius: 3,
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Avatar sx={{ bgcolor: '#6366f115', color: '#6366f1', width: 40, height: 40 }}>
                      <People />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Active Contracts
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {stats.activeContracts} contracts in progress
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    bgcolor: '#f9fafb',
                    borderRadius: 3,
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Avatar sx={{ bgcolor: '#f59e0b15', color: '#f59e0b', width: 40, height: 40 }}>
                      <TrendingUp />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        This Month's Spending
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        $8,500 across {stats.activeContracts} projects
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>

            {/* Quick Actions */}
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Quick Actions
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/jobs/create')}
                    sx={{
                      background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.5,
                      borderRadius: 3,
                    }}
                  >
                    Post New Job
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate('/jobs')}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: 3,
                      borderColor: '#e5e7eb',
                      '&:hover': { borderColor: '#6366f1' },
                    }}
                  >
                    Browse Jobs
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate('/contracts')}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: 3,
                      borderColor: '#e5e7eb',
                      '&:hover': { borderColor: '#6366f1' },
                    }}
                  >
                    Contracts
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate('/profile')}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: 3,
                      borderColor: '#e5e7eb',
                      '&:hover': { borderColor: '#6366f1' },
                    }}
                  >
                    Edit Profile
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ClientDashboard;