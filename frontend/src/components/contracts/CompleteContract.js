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
  TextField,
  Rating,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  ArrowBack,
  Star,
} from '@mui/icons-material';
import { contractAPI } from '../../api/contractAPI';

const CompleteContract = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
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

  const handleCompleteContract = async () => {
    if (!review.trim()) {
      setError('Please provide a review');
      return;
    }

    if (!window.confirm('Are you sure you want to complete this contract?')) {
      return;
    }

    try {
      setCompleting(true);
      await contractAPI.completeContract(id, rating, review);
      alert('✅ Contract completed successfully!');
      navigate(`/contracts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete contract');
    } finally {
      setCompleting(false);
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
            Complete Contract
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
              Finalizing: {contract.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Freelancer: {contract.freelancerName}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Total Amount:</Typography>
                <Typography>${contract.totalAmount}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Amount Paid:</Typography>
                <Typography>${contract.amountPaidToFreelancer}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Remaining in Escrow:</Typography>
                <Typography>${contract.amountInEscrow}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Important Notice:
          </Typography>
          <Typography variant="body2">
            Completing the contract will:
            <br />• Release remaining escrow funds to the freelancer
            <br />• Close the contract permanently
            <br />• Allow both parties to leave reviews
            <br />• Mark the job as completed
          </Typography>
        </Alert>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Rate the Freelancer
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography>Rating:</Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              size="large"
            />
            <Typography variant="body2" color="text.secondary">
              {rating} out of 5
            </Typography>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience working with this freelancer..."
            helperText="Your review helps others choose quality freelancers"
            sx={{ mb: 2 }}
          />
        </Box>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="success"
            size="large"
            startIcon={completing ? <CircularProgress size={20} /> : <CheckCircle />}
            onClick={handleCompleteContract}
            disabled={completing || !review.trim()}
            sx={{ py: 1.5, px: 4 }}
          >
            {completing ? 'Completing...' : 'Complete Contract & Release Payment'}
          </Button>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            Final step: Remaining ${contract.amountInEscrow} will be released to {contract.freelancerName}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default CompleteContract;