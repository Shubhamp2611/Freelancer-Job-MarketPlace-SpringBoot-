import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { Payment as PaymentIcon, Security as SecurityIcon, Verified as VerifiedIcon } from '@mui/icons-material';
import { contractAPI } from '../../api/contractAPI';

const steps = ['Review Contract', 'Fund Escrow', 'Work Begins'];

const EscrowPayment = () => {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(1);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await contractAPI.fundEscrow(contractId);
      setActiveStep(2);
      // Simulate API delay
      setTimeout(() => {
        navigate(`/contracts/${contractId}`);
      }, 1500);
    } catch (err) {
      console.error('Error funding escrow:', err);
      setError(err.response?.data?.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SecurityIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
          <Box>
            <Typography variant="h5" gutterBottom>
              Secure Escrow Payment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your funds are protected until work is completed
            </Typography>
          </Box>
        </Box>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Payment Summary
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Contract Amount:</Typography>
              <Typography fontWeight="bold">$500.00</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Platform Fee (10%):</Typography>
              <Typography color="text.secondary">$50.00</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total to Pay:</Typography>
              <Typography variant="h6" color="primary">$550.00</Typography>
            </Box>
          </CardContent>
        </Card>
        
        <Card variant="outlined" sx={{ mb: 3, bgcolor: '#f8f9fa' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <VerifiedIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="subtitle1" fontWeight="bold">
                How Escrow Protects You
              </Typography>
            </Box>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>
                <Typography variant="body2" color="text.secondary">
                  Funds held securely by platform
                </Typography>
              </li>
              <li>
                <Typography variant="body2" color="text.secondary">
                  Release only when you approve work
                </Typography>
              </li>
              <li>
                <Typography variant="body2" color="text.secondary">
                  14-day dispute period after delivery
                </Typography>
              </li>
              <li>
                <Typography variant="body2" color="text.secondary">
                  Full refund if work not delivered
                </Typography>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          By proceeding, you agree to our Terms of Service and authorize payment.
          Funds will be released to the freelancer upon your approval of completed work.
        </Typography>
        
        <Button
          fullWidth
          size="large"
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <PaymentIcon />}
          onClick={handlePayment}
          disabled={loading}
          sx={{
            background: 'linear-gradient(45deg, #1976d2, #2196f3)',
            py: 1.5,
            fontSize: '1.1rem',
            borderRadius: 2
          }}
        >
          {loading ? 'Processing...' : 'Pay Securely $550.00'}
        </Button>
        
        <Button
          fullWidth
          variant="outlined"
          sx={{ mt: 2, borderRadius: 2 }}
          onClick={() => navigate(`/contracts/${contractId}`)}
        >
          Cancel
        </Button>
      </Paper>
    </Box>
  );
};

export default EscrowPayment;