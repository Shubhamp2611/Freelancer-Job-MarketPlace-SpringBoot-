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
  Grid,
  IconButton,
  Card,
  CardContent
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { contractAPI } from '../../api/contractAPI';

const CreateContract = () => {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    proposalId: parseInt(proposalId),
    title: '',
    description: '',
    startDate: '',
    dueDate: '',
    milestones: [{
      title: 'Complete Project',
      description: 'Deliver all agreed upon work',
      amount: '0',
      dueDate: '',
      sequence: 1
    }]
  });

  const addMilestone = () => {
    setFormData({
      ...formData,
      milestones: [...formData.milestones, {
        title: '',
        description: '',
        amount: '0',
        dueDate: '',
        sequence: formData.milestones.length + 1
      }]
    });
  };

  const removeMilestone = (index) => {
    const updated = formData.milestones.filter((_, i) => i !== index);
    setFormData({ ...formData, milestones: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const contractData = {
        ...formData,
        milestones: formData.milestones.map(m => ({
          ...m,
          amount: parseFloat(m.amount) || 0
        }))
      };
      
      await contractAPI.createContract(contractData);
      navigate('/contracts');
    } catch (err) {
      console.error('Error creating contract:', err);
      setError(err.response?.data?.message || 'Failed to create contract');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Create Contract from Proposal #{proposalId}
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Contract Title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            margin="normal"
            required
            helperText="e.g., 'Website Development Project'"
          />
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Detailed Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            margin="normal"
            required
            helperText="Detailed scope of work, deliverables, and expectations"
          />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Start Date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Due Date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          
          <Card variant="outlined" sx={{ mt: 4, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Milestones & Payments
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={addMilestone}
                variant="outlined"
                size="small"
              >
                Add Milestone
              </Button>
            </Box>
            
            {formData.milestones.map((milestone, index) => (
              <Card key={index} sx={{ mb: 2, p: 2, position: 'relative' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Milestone {index + 1}
                </Typography>
                
                {formData.milestones.length > 1 && (
                  <IconButton
                    size="small"
                    onClick={() => removeMilestone(index)}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Milestone Title"
                      value={milestone.title}
                      onChange={(e) => {
                        const updated = [...formData.milestones];
                        updated[index].title = e.target.value;
                        setFormData({...formData, milestones: updated});
                      }}
                      size="small"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Deliverables"
                      value={milestone.description}
                      onChange={(e) => {
                        const updated = [...formData.milestones];
                        updated[index].description = e.target.value;
                        setFormData({...formData, milestones: updated});
                      }}
                      size="small"
                      helperText="What needs to be delivered for this milestone"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Amount ($)"
                      value={milestone.amount}
                      onChange={(e) => {
                        const updated = [...formData.milestones];
                        updated[index].amount = e.target.value;
                        setFormData({...formData, milestones: updated});
                      }}
                      size="small"
                      required
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="datetime-local"
                      label="Due Date"
                      value={milestone.dueDate}
                      onChange={(e) => {
                        const updated = [...formData.milestones];
                        updated[index].dueDate = e.target.value;
                        setFormData({...formData, milestones: updated});
                      }}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
              </Card>
            ))}
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Total Amount: ${formData.milestones.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0).toFixed(2)}
            </Typography>
          </Card>
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
              sx={{ flex: 1 }}
            >
              {loading ? 'Creating Contract...' : 'Create Contract'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateContract;