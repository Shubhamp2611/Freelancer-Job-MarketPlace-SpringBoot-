import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Avatar,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  People,
  Work,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  MoreVert,
  CheckCircle,
  Schedule,
  Flag,
  PersonAdd,
} from '@mui/icons-material';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 1248,
    totalJobs: 456,
    activeContracts: 89,
    totalRevenue: 124500,
    newUsersThisMonth: 156,
    completionRate: 94,
  });

  const [recentUsers, setRecentUsers] = useState([
    { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'FREELANCER', joined: '2 hours ago', status: 'active' },
    { id: 2, name: 'Mike Chen', email: 'mike@example.com', role: 'CLIENT', joined: '5 hours ago', status: 'active' },
    { id: 3, name: 'Emma Wilson', email: 'emma@example.com', role: 'FREELANCER', joined: '1 day ago', status: 'active' },
    { id: 4, name: 'David Brown', email: 'david@example.com', role: 'CLIENT', joined: '2 days ago', status: 'pending' },
  ]);

  const [recentJobs, setRecentJobs] = useState([
    { id: 1, title: 'Full Stack Development', client: 'TechCorp', budget: 5000, proposals: 15, status: 'OPEN' },
    { id: 2, title: 'UI/UX Design Project', client: 'DesignCo', budget: 3200, proposals: 8, status: 'IN_PROGRESS' },
    { id: 3, title: 'Mobile App Development', client: 'AppStart', budget: 8500, proposals: 22, status: 'OPEN' },
  ]);

  const StatCard = ({ icon, value, label, color, trend, trendValue, subtitle }) => (
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
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {React.cloneElement(icon, { sx: { fontSize: 32, color } })}
        </Box>
        {trend && (
          <Chip
            icon={trendValue > 0 ? <TrendingUp sx={{ fontSize: 16 }} /> : <TrendingDown sx={{ fontSize: 16 }} />}
            label={`${trendValue > 0 ? '+' : ''}${trendValue}%`}
            size="small"
            sx={{
              background: trendValue > 0 ? '#10b98120' : '#ef444420',
              color: trendValue > 0 ? '#10b981' : '#ef4444',
              fontWeight: 600,
            }}
          />
        )}
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

  const getRoleBadge = (role) => {
    const config = {
      FREELANCER: { bg: '#6366f115', color: '#6366f1', label: 'Freelancer' },
      CLIENT: { bg: '#10b98115', color: '#10b981', label: 'Client' },
      ADMIN: { bg: '#ef444415', color: '#ef4444', label: 'Admin' },
    };
    const { bg, color, label } = config[role] || config.FREELANCER;
    return <Chip label={label} size="small" sx={{ bgcolor: bg, color, fontWeight: 600 }} />;
  };

  const getStatusBadge = (status) => {
    const config = {
      OPEN: { bg: '#10b98115', color: '#10b981', label: 'Open' },
      IN_PROGRESS: { bg: '#f59e0b15', color: '#f59e0b', label: 'In Progress' },
      COMPLETED: { bg: '#6366f115', color: '#6366f1', label: 'Completed' },
      active: { bg: '#10b98115', color: '#10b981', label: 'Active' },
      pending: { bg: '#f59e0b15', color: '#f59e0b', label: 'Pending' },
    };
    const { bg, color, label } = config[status] || config.active;
    return <Chip label={label} size="small" sx={{ bgcolor: bg, color, fontWeight: 600 }} />;
  };

  return (
    <Box sx={{ bgcolor: '#f9fafb', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Admin Dashboard 🎯
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor and manage your marketplace platform
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<People />}
              value={stats.totalUsers.toLocaleString()}
              label="Total Users"
              color="#6366f1"
              trend
              trendValue={12.5}
              subtitle={`+${stats.newUsersThisMonth} this month`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<Work />}
              value={stats.totalJobs}
              label="Total Jobs"
              color="#10b981"
              trend
              trendValue={8.3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<CheckCircle />}
              value={stats.activeContracts}
              label="Active Contracts"
              color="#f59e0b"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<AttachMoney />}
              value={`$${stats.totalRevenue.toLocaleString()}`}
              label="Total Revenue"
              color="#8b5cf6"
              trend
              trendValue={23.1}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Platform Performance */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb', height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Platform Performance
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Job Completion Rate
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
                      4.8
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Avg Rating
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f9fafb', borderRadius: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                      1.2h
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Avg Response
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                  User Distribution
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Freelancers
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        62%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={62}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: '#e5e7eb',
                        '& .MuiLinearProgress-bar': { bgcolor: '#6366f1', borderRadius: 3 },
                      }}
                    />
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Clients
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        38%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={38}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: '#e5e7eb',
                        '& .MuiLinearProgress-bar': { bgcolor: '#10b981', borderRadius: 3 },
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Recent Users */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Recent Users
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Latest user registrations
                  </Typography>
                </Box>
                <Chip
                  icon={<PersonAdd />}
                  label={`${stats.newUsersThisMonth} new`}
                  sx={{ bgcolor: '#10b98115', color: '#10b981', fontWeight: 600 }}
                />
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem' }}>USER</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem' }}>ROLE</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem' }}>STATUS</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem' }}>JOINED</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{
                                bgcolor: '#6366f1',
                                width: 36,
                                height: 36,
                                fontSize: '0.875rem',
                                fontWeight: 600,
                              }}
                            >
                              {user.name[0]}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {user.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {user.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {user.joined}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Recent Jobs */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Recent Jobs
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Latest job postings on the platform
                  </Typography>
                </Box>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem' }}>JOB TITLE</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem' }}>CLIENT</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem' }}>BUDGET</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem' }}>PROPOSALS</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem' }}>STATUS</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentJobs.map((job) => (
                      <TableRow key={job.id} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {job.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 28, height: 28, bgcolor: '#10b981', fontSize: '0.75rem' }}>
                              {job.client[0]}
                            </Avatar>
                            <Typography variant="body2">{job.client}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#6366f1' }}>
                            ${job.budget.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${job.proposals} proposals`}
                            size="small"
                            sx={{ bgcolor: '#f3f4f6', fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>{getStatusBadge(job.status)}</TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;