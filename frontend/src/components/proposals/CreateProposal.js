import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import { proposalAPI } from '../../api/proposalAPI';

const CreateProposal = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    coverLetter: '',
    proposedPrice: '',
    estimatedDays: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await proposalAPI.submitProposal({
        jobId: parseInt(jobId),
        ...formData,
        proposedPrice: parseFloat(formData.proposedPrice),
        estimatedDays: parseInt(formData.estimatedDays)
      });
      
      // Success - redirect to job page
      navigate(`/jobs/${jobId}`);
    } catch (err) {
      console.error('Error submitting proposal:', err);
      setError(err.response?.data?.message || 'Failed to submit proposal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Submit Proposal
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Cover Letter"
            value={formData.coverLetter}
            onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
            margin="normal"
            required
            placeholder="Introduce yourself and explain why you're the best fit for this job..."
          />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Proposed Price ($)"
                value={formData.proposedPrice}
                onChange={(e) => setFormData({...formData, proposedPrice: e.target.value})}
                margin="normal"
                required
                inputProps={{ min: 1, step: 0.01 }}
                helperText="Your total project price"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Estimated Days"
                value={formData.estimatedDays}
                onChange={(e) => setFormData({...formData, estimatedDays: e.target.value})}
                margin="normal"
                required
                inputProps={{ min: 1 }}
                helperText="How many days to complete"
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
              sx={{ flex: 1 }}
            >
              {loading ? 'Submitting...' : 'Submit Proposal'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(`/jobs/${jobId}`)}
            >
              Cancel
            </Button>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Note: Once submitted, you cannot edit your proposal. The client will review and respond.
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateProposal;