import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Button,
  Paper,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ContractCard from './ContractCard';
import { contractAPI } from '../../api/contractAPI';

const ContractList = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState('active');
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching contracts for user:', user.id, user.role);
      
      const response = await contractAPI.getMyContracts();
      console.log('Contracts API response:', response.data);
      
      if (!response.data) {
        console.warn('No data in response');
      }
      
      setContracts(response.data || []);
      
    } catch (err) {
      console.error('Error fetching contracts:', err);
      
      // Detailed error message
      const errorMsg = err.response?.data?.message || 
                       err.message || 
                       'Failed to load contracts';
      
      setError(`Error: ${errorMsg}`);
      
      // Show empty state for now
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredContracts = contracts.filter(contract => {
    if (!contract || !contract.status) return false;
    
    switch (tabValue) {
      case 'active':
        return contract.status === 'ACTIVE';
      case 'pending':
        return contract.status === 'PENDING';
      case 'completed':
        return contract.status === 'COMPLETED';
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography>Loading contracts...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: 'primary.light', color: 'white' }}>
          <Typography variant="h4" gutterBottom>
            My Contracts
          </Typography>
          <Typography variant="body1">
            {user.role === 'CLIENT' 
              ? 'Manage your contracts with freelancers' 
              : 'View your active projects and track payments'}
          </Typography>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
            <Button 
              size="small" 
              onClick={fetchContracts}
              sx={{ ml: 2 }}
            >
              Retry
            </Button>
          </Alert>
        )}

        {/* Quick stats */}
        {contracts.length > 0 && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={4}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h4">{contracts.length}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
                <Typography variant="h6">Active</Typography>
                <Typography variant="h4">
                  {contracts.filter(c => c.status === 'ACTIVE').length}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
                <Typography variant="h6">Pending</Typography>
                <Typography variant="h4">
                  {contracts.filter(c => c.status === 'PENDING').length}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Tabs for filtering */}
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              variant="fullWidth"
            >
              <Tab label={`Active (${contracts.filter(c => c.status === 'ACTIVE').length})`} value="active" />
              <Tab label={`Pending (${contracts.filter(c => c.status === 'PENDING').length})`} value="pending" />
              <Tab label={`Completed (${contracts.filter(c => c.status === 'COMPLETED').length})`} value="completed" />
              <Tab label={`All (${contracts.length})`} value="all" />
            </Tabs>
          </Box>
        </Paper>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          {user.role === 'CLIENT' && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/post-job')}
            >
              Post a New Job
            </Button>
          )}
          <Button
            variant="outlined"
            onClick={fetchContracts}
          >
            Refresh
          </Button>
        </Box>

        {/* Contracts Grid */}
        {filteredContracts.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            {error ? (
              <>
                <Typography variant="h6" color="error" gutterBottom>
                  Could not load contracts
                </Typography>
                <Typography variant="body2">
                  Try refreshing the page or check your connection
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  No contracts found
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {user.role === 'CLIENT' 
                    ? 'Create a job posting to get started with freelancers.' 
                    : 'Apply for jobs to get contracts.'}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/jobs')}
                >
                  Browse Jobs
                </Button>
              </>
            )}
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredContracts.map((contract, index) => (
              <Grid item xs={12} md={6} lg={4} key={contract.id || index}>
                <ContractCard 
                  contract={contract} 
                  userRole={user.role}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Debug info (remove in production) */}
        <Paper sx={{ p: 2, mt: 4, bgcolor: 'grey.100' }}>
          <Typography variant="caption" color="text.secondary">
            Debug: User ID: {user.id} | Role: {user.role} | Contracts: {contracts.length}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default ContractList;