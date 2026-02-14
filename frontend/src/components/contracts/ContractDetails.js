import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
} from '@mui/material';
import { contractAPI } from '../../api/contractAPI';

const ContractDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContractDetails();
  }, [id]);

  const fetchContractDetails = async () => {
    try {
      setLoading(true);
      const response = await contractAPI.getContractById(id);
      setContract(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load contract details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'COMPLETED':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !contract) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || 'Contract not found'}
        </Alert>
        <Button onClick={() => navigate('/contracts')} sx={{ mt: 2 }}>
          Back to Contracts
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4">{contract.title}</Typography>
            <Chip
              label={contract.status}
              color={getStatusColor(contract.status)}
              size="large"
            />
          </Box>

          <Typography variant="body1" paragraph>
            {contract.description}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Contract Details
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Total Amount"
                    secondary={`$${contract.totalAmount}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Platform Fee"
                    secondary={`$${contract.platformFee}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Freelancer Earnings"
                    secondary={`$${contract.freelancerEarnings}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Start Date"
                    secondary={new Date(contract.startDate).toLocaleDateString()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Due Date"
                    secondary={new Date(contract.dueDate).toLocaleDateString()}
                  />
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Parties
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Client"
                    secondary={contract.clientName}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Freelancer"
                    secondary={contract.freelancerName}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>

          {contract.milestones && contract.milestones.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>
                Milestones
              </Typography>
              <List>
                {contract.milestones.map((milestone, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={milestone.title}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            Amount: ${milestone.amount}
                          </Typography>
                          <Typography variant="body2">
                            Status: {milestone.status}
                          </Typography>
                          {milestone.status === 'IN_PROGRESS' && (
                            <LinearProgress sx={{ mt: 1 }} />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/contracts')}>
              Back to Contracts
            </Button>
            {contract.status === 'PENDING' && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/contracts/${id}/fund`)}
              >
                Fund Escrow
              </Button>
            )}
            {contract.status === 'ACTIVE' && (
              <Button
                variant="contained"
                color="success"
                onClick={() => navigate(`/contracts/${id}/complete`)}
              >
                Complete Contract
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ContractDetails;