/* eslint-disable no-unused-vars */
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
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Work,
  AttachMoney,
  Star,
  Description,
  TrendingUp,
  Notifications,
  Search,
  FilterList,
  ArrowForward,
  Schedule,
  // eslint-disable-next-line no-unused-vars
  PersonOutline,
  CheckCircle,
  Pending,
  Visibility,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../api/jobAPI';
import { proposalAPI } from '../api/proposalAPI';
import { contractAPI } from '../api/contractAPI';

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeContracts: 0,
    pendingProposals: 0,
    totalEarnings: 0,
    rating: 0,
    completionRate: 95,
    responseTime: '2h',
  });
  const [loading, setLoading] = useState(true);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [activeProposals, setActiveProposals] = useState([]);
  const [user, setUser] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch open jobs
      const jobsResponse = await jobAPI.getJobs('open');
      const allJobs = jobsResponse.data || [];
      
      // Fetch proposals
      let myProposals = [];
      try {
        const proposalsResponse = await proposalAPI.getMyProposals();
        myProposals = proposalsResponse.data || [];
      } catch (err) {
        console.log('Proposals endpoint not available yet');
      }
      
      // Fetch contracts
      let myContracts = [];
      try {
        const contractsResponse = await contractAPI.getMyContracts();
        myContracts = contractsResponse.data || [];
        setContracts(myContracts);
      } catch (err) {
        console.log('Contracts endpoint not available yet');
      }
      
      // Get recommended jobs (limit to 3)
      const recommended = allJobs.slice(0, 3);
      
      // Calculate real stats
      const activeContractsCount = myContracts.filter(c => c.status === 'ACTIVE' || c.status === 'IN_PROGRESS').length;
      const pendingProposalsCount = myProposals.filter(p => p.status === 'PENDING').length;
      const totalEarnings = myContracts
        .filter(c => c.status === 'COMPLETED')
        .reduce((sum, c) => sum + (c.freelancerEarnings || c.totalAmount || 0), 0);
      
      setStats({
        activeContracts: activeContractsCount,
        pendingProposals: pendingProposalsCount,
        totalEarnings: totalEarnings || 12450, // fallback if no data
        rating: user?.rating || 4.8,
        completionRate: 95,
        responseTime: '2h',
      });
      
      setRecommendedJobs(recommended);
      
      // Set active proposals from API
      setActiveProposals(myProposals.slice(0, 3).map(p => ({
        id: p.id,
        job: p.jobTitle || 'Job',
        status: p.status || 'PENDING',
        sent: p.submittedAt ? new Date(p.submittedAt).toLocaleDateString() : 'Recently',
        bid: p.proposedPrice || 0
      })));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  function StatCard({ icon, value, label, color, trend, trendValue }) {
      return (
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
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {React.cloneElement(icon, { sx: { fontSize: 32, color } })}
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                {value}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {label}
              </Typography>
            </Box>
            {trend && (
              <Chip
                label={`${trendValue > 0 ? '+' : ''}${trendValue}%`}
                size="small"
                sx={{
                  background: trendValue > 0 ? '#10b98120' : '#ef444420',
                  color: trendValue > 0 ? '#10b981' : '#ef4444',
                  fontWeight: 600,
                }} />
            )}
          </Box>
        </Paper>
      );
    }

  const JobCard = ({ job }) => (
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
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {job.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Avatar sx={{ width: 24, height: 24, bgcolor: '#6366f1', fontSize: '0.75rem' }}>
                {(job.client?.name || 'Client')[0]}
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#6366f1' }}>
              ${job.budget?.toLocaleString() || '0'}
            </Typography>
            <Chip
              label={job.type}
              size="small"
              sx={{ mt: 0.5, bgcolor: '#6366f120', color: '#6366f1', fontWeight: 600 }}
            />
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

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {job.skillsRequired?.split(',').slice(0, 3).map((skill, idx) => (
            <Chip
              key={idx}
              label={skill.trim()}
              size="small"
              sx={{
                bgcolor: '#f3f4f6',
                fontWeight: 500,
                fontSize: '0.75rem',
              }}
            />
          )) || <Chip label="No skills listed" size="small" sx={{ bgcolor: '#f3f4f6' }} />}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {job.estimatedDuration || 'N/A'} days
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              View Details
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => handlePropose(job.id)}
              sx={{
                background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
              }}
            >
              Propose
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
  const ProposalStatusChip = ({ status }) => {
    const config = {
      PENDING: { icon: <Pending sx={{ fontSize: 12 }} />, color: '#f59e0b', bg: '#f59e0b15', label: 'Pending Review' },
      VIEWED: { icon: <Visibility sx={{ fontSize: 12 }} />, color: '#3b82f6', bg: '#3b82f615', label: 'Viewed' },
      SHORTLISTED: { icon: <CheckCircle sx={{ fontSize: 12 }} />, color: '#10b981', bg: '#10b98115', label: 'Shortlisted' },
    };
    const { icon, color, bg, label } = config[status] || config.PENDING;
    return (
      <Chip
        icon={icon}
        label={label}
        size="small"
        sx={{ bgcolor: bg, color, fontWeight: 600 }}
      />
    );
  };

  const handlePropose = (jobId) => {
    navigate(`/jobs/${jobId}/propose`);
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
              Welcome back, {user?.name || 'Freelancer'}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here's what's happening with your work today
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
              startIcon={<Search />}
              onClick={() => navigate('/jobs')}
              sx={{
                background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
                },
              }}
            >
              Find Jobs
            </Button>
          </Box>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<Work />}
              value={stats.activeContracts}
              label="Active Contracts"
              color="#6366f1"
              trend
              trendValue={12}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<Description />}
              value={stats.pendingProposals}
              label="Pending Proposals"
              color="#8b5cf6"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<AttachMoney />}
              value={`$${stats.totalEarnings.toLocaleString()}`}
              label="Total Earnings"
              color="#10b981"
              trend
              trendValue={23}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<Star />}
              value={stats.rating}
              label="Client Rating"
              color="#f59e0b"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Recommended Jobs */}
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
              Recommended Jobs For You
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Based on your skills and preferences
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => navigate('/jobs')}
          >
            Filter
          </Button>
        </Box>

        {recommendedJobs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No jobs available at the moment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Check back later for new job postings
            </Typography>
          </Box>
        ) : (
          <>
            {recommendedJobs.map((job) => (
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
          {/* Performance Metrics */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid #e5e7eb' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Your Performance
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Job Success Rate
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {stats.completionRate}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stats.completionRate}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: '#e5e7eb',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #10b981, #059669)',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f9fafb', borderRadius: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#6366f1' }}>
                      {stats.responseTime}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Avg Response
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f9fafb', borderRadius: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                      100%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      On-Time Delivery
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Active Proposals */}
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Active Proposals
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {activeProposals.map((proposal) => (
                  <Box
                    key={proposal.id}
                    sx={{
                      p: 2,
                      bgcolor: '#f9fafb',
                      borderRadius: 3,
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {proposal.job}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#6366f1' }}>
                        ${proposal.bid}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <ProposalStatusChip status={proposal.status} />
                      <Typography variant="caption" color="text.secondary">
                        {proposal.sent}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Button
                fullWidth
                variant="text"
                onClick={() => navigate('/my-proposals')}
                sx={{
                  mt: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#6366f1',
                }}
              >
                View All Proposals
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FreelancerDashboard;