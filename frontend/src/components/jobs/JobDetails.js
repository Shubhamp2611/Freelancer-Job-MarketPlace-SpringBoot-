/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { 
  AccessTime, 
  AttachMoney, 
  Work, 
  Person, 
  Description,
  CheckCircle,
  Cancel,
  Message,
  ArrowForward // ADD THIS IMPORT
} from '@mui/icons-material';
import { jobAPI } from '../../api/jobAPI';
import { proposalAPI } from '../../api/proposalAPI';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [proposals, setProposals] = useState([]);
  const [proposalsLoading, setProposalsLoading] = useState(false);
  
  // Proposal submission state
  const [proposalData, setProposalData] = useState({
    coverLetter: '',
    proposedPrice: '',
    estimatedDays: '',
  });
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState('');
  
  // Proposal actions state (for clients)
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(''); // 'accept' or 'reject' or 'create-contract'
  const [actionMessage, setActionMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchJobDetails();
    if (user.role === 'CLIENT') {
      fetchProposals();
    }
  }, [id, user.role]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getJobById(id);
      setJob(response.data);
    } catch (err) {
      setError('Failed to fetch job details');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProposals = async () => {
    try {
      setProposalsLoading(true);
      const response = await proposalAPI.getProposalsForJob(id);
      setProposals(response.data || []);
    } catch (err) {
      console.log('Cannot fetch proposals:', err.message);
      // This is normal if endpoint doesn't exist yet
    } finally {
      setProposalsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    setSubmittingProposal(true);
    setError('');

    if (!proposalData.coverLetter || !proposalData.proposedPrice || !proposalData.estimatedDays) {
      setError('Please fill all fields');
      setSubmittingProposal(false);
      return;
    }

    if (proposalData.coverLetter.length < 50) {
      setError('Cover letter must be at least 50 characters');
      setSubmittingProposal(false);
      return;
    }

    try {
      const proposal = {
        jobId: id,
        coverLetter: proposalData.coverLetter,
        proposedPrice: parseFloat(proposalData.proposedPrice),
        estimatedDays: parseInt(proposalData.estimatedDays),
      };

      await proposalAPI.submitProposal(proposal);
      setProposalSuccess('✅ Proposal submitted successfully!');
      setProposalData({ coverLetter: '', proposedPrice: '', estimatedDays: '' });
      
      setTimeout(() => {
        setProposalSuccess('');
        navigate('/my-proposals');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit proposal');
    } finally {
      setSubmittingProposal(false);
    }
  };

  const handleAction = async () => {
    if (!selectedProposal) {
      alert('No proposal selected');
      return;
    }

    try {
      setActionLoading(true);
      
      if (actionType === 'accept') {
        // Accept the proposal
        await proposalAPI.acceptProposal(selectedProposal.id, actionMessage);
        alert('✅ Proposal accepted successfully!');
        
        // After accepting, navigate to create contract page
        navigate(`/proposals/${selectedProposal.id}/create-contract`);
      } else if (actionType === 'create-contract') {
        // Directly navigate to create contract (for already accepted proposals)
        navigate(`/proposals/${selectedProposal.id}/create-contract`);
      } else {
        // Reject proposal
        await proposalAPI.rejectProposal(selectedProposal.id, actionMessage);
        alert('Proposal rejected.');
      }
      
      setActionDialogOpen(false);
      setActionMessage('');
      fetchProposals(); // Refresh proposals list
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${actionType} proposal`);
    } finally {
      setActionLoading(false);
    }
  };

  const openActionDialog = (proposal, type) => {
    setSelectedProposal(proposal);
    setActionType(type);
    
    if (type === 'accept') {
      setActionMessage(`Congratulations! Your proposal has been accepted for the job "${job.title}". We look forward to working with you.`);
    } else if (type === 'create-contract') {
      setActionMessage(''); // No message needed for contract creation
    } else {
      setActionMessage(`Thank you for your proposal. Unfortunately, we have decided to go with another candidate for this project.`);
    }
    
    if (type === 'create-contract') {
      // Direct navigation for create-contract
      navigate(`/proposals/${proposal.id}/create-contract`);
    } else {
      setActionDialogOpen(true);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography>Loading job details...</Typography>
      </Container>
    );
  }

  if (error && !job) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate('/jobs')} sx={{ mt: 2 }}>
          Back to Jobs
        </Button>
      </Container>
    );
  }

  if (!job) return null;

  const isJobOwner = user.id === job.clientId;
  const isFreelancer = user.role === 'FREELANCER';
  const isClient = user.role === 'CLIENT';

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4">{job.title}</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              label={`$${job.budget}`} 
              color="primary" 
              icon={<AttachMoney />}
              size="medium"
            />
            <Chip 
              label={job.status} 
              color={job.status === 'OPEN' ? 'success' : 'default'} 
              size="medium"
            />
          </Box>
        </Box>
        
        {/* Tabs - Only show proposals tab for job owner */}
        {(isJobOwner && proposals.length > 0) && (
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Job Details" />
              <Tab label={`Proposals (${proposals.length})`} />
            </Tabs>
          </Box>
        )}
        
        {tabValue === 0 ? (
          <>
            <Box sx={{ mb: 3 }}>
              <Chip 
                label={job.type} 
                variant="outlined" 
                sx={{ mr: 1, mb: 1 }} 
                icon={<Work />}
              />
              <Chip 
                label={`${job.estimatedDuration || 'N/A'} days`} 
                variant="outlined" 
                sx={{ mr: 1, mb: 1 }}
                icon={<AccessTime />}
              />
              {job.skillsRequired && (
                <Chip 
                  label="Skills Required" 
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
              )}
            </Box>
            
            <Typography variant="h6" gutterBottom>Description</Typography>
            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>
              {job.description}
            </Typography>
            
            {job.skillsRequired && (
              <>
                <Typography variant="h6" gutterBottom>Skills Required</Typography>
                <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {job.skillsRequired.split(',').map((skill, index) => (
                    <Chip 
                      key={index}
                      label={skill.trim()}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </>
            )}
            
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Budget
                </Typography>
                <Typography variant="h6" color="primary">
                  ${job.budget}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Created Date
                </Typography>
                <Typography variant="body1">
                  {new Date(job.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Client Information
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Person sx={{ mr: 2 }} />
              <Box>
                <Typography variant="body1">
                  <strong>Name:</strong> {job.clientName || 'Unknown'}
                </Typography>
                {job.clientEmail && (
                  <Typography variant="body2" color="textSecondary">
                    Email: {job.clientEmail}
                  </Typography>
                )}
              </Box>
            </Box>
            
            {/* TWO OPTIONS FOR PROPOSAL SUBMISSION */}
            {isFreelancer && job.status === 'OPEN' && !isJobOwner && (
              <>
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="h5" gutterBottom>
                  Submit Proposal
                </Typography>
                
                <Grid container spacing={3}>
                  {/* OPTION 1: Quick Apply Form (Your existing form) */}
                  <Grid item xs={12} md={7}>
                    <Box id="proposal-form">
                      {proposalSuccess && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                          {proposalSuccess}
                        </Alert>
                      )}
                      
                      {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                          {error}
                        </Alert>
                      )}
                      
                      <Box component="form" onSubmit={handleProposalSubmit}>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          label="Cover Letter"
                          placeholder="Describe why you're the best fit for this job. Include your relevant experience and approach..."
                          value={proposalData.coverLetter}
                          onChange={(e) => setProposalData({
                            ...proposalData,
                            coverLetter: e.target.value
                          })}
                          margin="normal"
                          required
                          disabled={submittingProposal}
                          helperText="Minimum 50 characters"
                          error={proposalData.coverLetter.length > 0 && proposalData.coverLetter.length < 50}
                        />
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Your Proposed Price ($)"
                              value={proposalData.proposedPrice}
                              onChange={(e) => setProposalData({
                                ...proposalData,
                                proposedPrice: e.target.value
                              })}
                              margin="normal"
                              required
                              disabled={submittingProposal}
                              helperText={`Client budget: $${job.budget}`}
                              InputProps={{
                                startAdornment: <AttachMoney sx={{ mr: 1, color: 'text.secondary' }} />,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Estimated Days to Complete"
                              value={proposalData.estimatedDays}
                              onChange={(e) => setProposalData({
                                ...proposalData,
                                estimatedDays: e.target.value
                              })}
                              margin="normal"
                              required
                              disabled={submittingProposal}
                              helperText={`Client estimate: ${job.estimatedDuration || 'N/A'} days`}
                              InputProps={{
                                startAdornment: <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />,
                              }}
                            />
                          </Grid>
                        </Grid>
                        
                        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={submittingProposal}
                            sx={{ minWidth: 150 }}
                          >
                            {submittingProposal ? (
                              <CircularProgress size={24} />
                            ) : (
                              'Submit Proposal'
                            )}
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => navigate('/jobs')}
                            disabled={submittingProposal}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  
                  {/* OPTION 2: New Detailed Form Link */}
                  <Grid item xs={12} md={5}>
                    <Paper variant="outlined" sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Typography variant="h6" gutterBottom>
                        <Description sx={{ verticalAlign: 'middle', mr: 1 }} />
                        Detailed Proposal
                      </Typography>
                      <Typography variant="body2" color="textSecondary" paragraph>
                        Use our enhanced proposal form with:
                      </Typography>
                      <ul style={{ margin: 0, paddingLeft: 20, marginBottom: 20 }}>
                        <li><Typography variant="body2">Project breakdown</Typography></li>
                        <li><Typography variant="body2">Timeline visualization</Typography></li>
                        <li><Typography variant="body2">Portfolio attachment</Typography></li>
                        <li><Typography variant="body2">Previous work examples</Typography></li>
                      </ul>
                      <Button
                        variant="outlined"
                        fullWidth
                        endIcon={<ArrowForward />}
                        onClick={() => navigate(`/jobs/${id}/propose`)}
                        sx={{ mt: 'auto' }}
                      >
                        Use Enhanced Form
                      </Button>
                    </Paper>
                  </Grid>
                </Grid>
              </>
            )}
          </>
        ) : (
          /* PROPOSALS TAB FOR CLIENTS */
          <Box>
            <Typography variant="h5" gutterBottom>
              Proposals ({proposals.length})
            </Typography>
            
            {proposalsLoading ? (
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <CircularProgress />
                <Typography>Loading proposals...</Typography>
              </Box>
            ) : proposals.length === 0 ? (
              <Alert severity="info">
                No proposals yet. Share your job link to attract freelancers.
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {proposals.map((proposal) => (
                  <Grid item xs={12} key={proposal.id}>
                    <Paper sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                          <Typography variant="h6">
                            <Person sx={{ verticalAlign: 'middle', mr: 1 }} />
                            {proposal.freelancerName}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {proposal.freelancerEmail}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ textAlign: 'right' }}>
                          <Chip 
                            label={`$${proposal.proposedPrice}`} 
                            color="primary" 
                            sx={{ mr: 1, mb: 1 }}
                          />
                          <Chip 
                            label={`${proposal.estimatedDays} days`}
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                      
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Cover Letter
                      </Typography>
                      <Typography variant="body2" paragraph sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                        {proposal.coverLetter}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Typography variant="caption" color="textSecondary">
                          Submitted: {new Date(proposal.submittedAt).toLocaleDateString()}
                        </Typography>
                        
                        {proposal.status === 'PENDING' && (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<CheckCircle />}
                              onClick={() => openActionDialog(proposal, 'accept')}
                            >
                              Accept & Create Contract
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Cancel />}
                              onClick={() => openActionDialog(proposal, 'reject')}
                            >
                              Reject
                            </Button>
                          </Box>
                        )}
                        
                        {proposal.status === 'ACCEPTED' && (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip 
                              label="Accepted" 
                              color="success" 
                              icon={<CheckCircle />}
                            />
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<Description />}
                              onClick={() => openActionDialog(proposal, 'create-contract')}
                            >
                              Create Contract
                            </Button>
                          </Box>
                        )}
                        
                        {proposal.status === 'REJECTED' && (
                          <Chip 
                            label="Rejected" 
                            color="error" 
                            icon={<Cancel />}
                          />
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
        
        <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/jobs')}
          >
            Back to Jobs
          </Button>
          
          {isJobOwner && job.status === 'OPEN' && (
            <Button
              variant="contained"
              onClick={() => navigate(`/jobs/${job.id}/edit`)}
            >
              Edit Job
            </Button>
          )}
          
          {isFreelancer && job.status === 'OPEN' && !isJobOwner && (
            <Button
              variant="contained"
              onClick={() => {
                setProposalData({
                  coverLetter: '',
                  proposedPrice: job.budget * 0.8,
                  estimatedDays: job.estimatedDuration || 30,
                });
                // Scroll to proposal form
                document.getElementById('proposal-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Quick Apply
            </Button>
          )}
        </Box>
      </Paper>

      {/* Action Dialog for Accept/Reject Proposals */}
      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'accept' ? 'Accept Proposal & Create Contract' : 'Reject Proposal'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            {actionType === 'accept' 
              ? `You are accepting the proposal from ${selectedProposal?.freelancerName}. You'll create a contract next.`
              : `You are rejecting the proposal from ${selectedProposal?.freelancerName}.`
            }
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={`Message to ${selectedProposal?.freelancerName}`}
            value={actionMessage}
            onChange={(e) => setActionMessage(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button 
            variant={actionType === 'accept' ? "contained" : "outlined"}
            color={actionType === 'accept' ? "primary" : "error"}
            onClick={handleAction}
            disabled={actionLoading || !actionMessage.trim()}
          >
            {actionLoading ? (
              <CircularProgress size={24} />
            ) : actionType === 'accept' ? (
              'Accept & Continue'
            ) : (
              'Reject Proposal'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default JobDetails;