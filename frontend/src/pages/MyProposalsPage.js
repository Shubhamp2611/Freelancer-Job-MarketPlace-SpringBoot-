import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { proposalAPI } from '../api/proposalAPI';

const MyProposalsPage = () => {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyProposals();
  }, []);

  const fetchMyProposals = async () => {
    try {
      setLoading(true);
      const response = await proposalAPI.getMyProposals();
      setProposals(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'ACCEPTED':
        return 'success';
      case 'REJECTED':
        return 'error';
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Proposals
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {proposals.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No proposals yet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Browse jobs and submit your first proposal
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/jobs')}
            >
              Browse Jobs
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {proposals.map((proposal) => (
              <Grid item xs={12} key={proposal.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">
                        {proposal.jobTitle}
                      </Typography>
                      <Chip
                        label={proposal.status}
                        color={getStatusColor(proposal.status)}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" paragraph>
                      {proposal.coverLetter?.substring(0, 200)}...
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Chip
                        label={`$${proposal.proposedPrice}`}
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        label={`${proposal.estimatedDays} days`}
                        variant="outlined"
                        size="small"
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Submitted: {new Date(proposal.submittedAt).toLocaleDateString()}
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => navigate(`/jobs/${proposal.jobId}`)}
                      >
                        View Job
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default MyProposalsPage;