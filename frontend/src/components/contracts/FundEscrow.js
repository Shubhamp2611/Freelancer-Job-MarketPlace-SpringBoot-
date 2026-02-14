import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  AttachMoney,
  ArrowBack,
  CheckCircle,
} from '@mui/icons-material';
import { contractAPI } from '../../api/contractAPI';

const FundEscrow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [funding, setFunding] = useState(false);
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
      setError('Failed to load contract details');
    } finally {
      setLoading(false);
    }
  };

  const handleFundEscrow = async () => {
    if (!window.confirm(`Are you sure you want to fund $${contract.totalAmount} to escrow?`)) {
      return;
    }

    try {
      setFunding(true);
      await contractAPI.fundEscrow(id);
      alert('✅ Escrow funded successfully!');
      navigate(`/contracts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fund escrow');
    } finally {
      setFunding(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography>Loading contract details...</Typography>
      </Container>
    );
  }

  if (!contract) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Contract not found</Alert>
        <Button onClick={() => navigate('/contracts')} sx={{ mt: 2 }}>
          Back to Contracts
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(`/contracts/${id}`)}
          >
            Back to Contract
          </Button>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Fund Escrow
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Contract: {contract.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {contract.description.substring(0, 200)}...
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Total Amount:</Typography>
                <Typography variant="h6" color="primary">
                  ${contract.totalAmount}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Platform Fee (10%):</Typography>
                <Typography color="text.secondary">
                  ${contract.platformFee}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Freelancer Earnings:</Typography>
                <Typography variant="h6" color="success.main">
                  ${contract.freelancerEarnings}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            How Escrow Works:
          </Typography>
          <Typography variant="body2">
            1. Funds are held securely in escrow<br />
            2. Money is released to freelancer upon milestone approval<br />
            3. Platform fee (10%) is deducted from total<br />
            4. You can request refunds if terms are not met
          </Typography>
        </Alert>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={funding ? <CircularProgress size={20} /> : <AttachMoney />}
            onClick={handleFundEscrow}
            disabled={funding || contract.escrowFunded}
            sx={{ py: 1.5, px: 4 }}
          >
            {funding ? 'Processing...' : `Fund Escrow - $${contract.totalAmount}`}
          </Button>
          
          {contract.escrowFunded && (
            <Alert severity="success" sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle />
                <Typography>Escrow is already funded</Typography>
              </Box>
            </Alert>
          )}
          
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            By clicking "Fund Escrow", you agree to our Terms of Service
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default FundEscrow;