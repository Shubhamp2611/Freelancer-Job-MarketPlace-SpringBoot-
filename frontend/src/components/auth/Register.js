import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Grid,
  InputAdornment,
  IconButton,
  Fade,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../../api/authAPI';
import { 
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Business,
  Code,
  ArrowBack,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'FREELANCER',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: (userData) => authAPI.register(userData),
    onSuccess: (response) => {
      const { accessToken, email } = response.data;
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify({ 
        email, 
        role: formData.role,
        name: formData.name 
      }));
      navigate('/');
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleNext = () => {
    setError('');
    if (activeStep === 0) {
      if (!formData.name || !formData.email) {
        setError('Please fill in all fields');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }
    }
    if (activeStep === 1) {
      if (!formData.password || !formData.confirmPassword) {
        setError('Please fill in both password fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const { confirmPassword, ...submitData } = formData;
    registerMutation.mutate(submitData);
  };

  const steps = ['Personal Info', 'Account Security', 'Choose Your Role'];

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#ec4899' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': {
                      borderColor: '#ec4899',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ec4899',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#ec4899' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': {
                      borderColor: '#ec4899',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ec4899',
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#ec4899' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': {
                      borderColor: '#ec4899',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ec4899',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#ec4899' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': {
                      borderColor: '#ec4899',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ec4899',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Alert 
                severity="info" 
                sx={{ 
                  borderRadius: '12px',
                  bgcolor: '#f0f9ff',
                  color: '#0369a1',
                }}
              >
                Password must be at least 6 characters long
              </Alert>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                Choose how you want to use FreelanceHub
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Paper
                  onClick={() => handleChange({ target: { name: 'role', value: 'CLIENT' } })}
                  sx={{
                    p: 3,
                    cursor: 'pointer',
                    borderRadius: '16px',
                    border: formData.role === 'CLIENT' ? '3px solid #10b981' : '2px solid #e5e7eb',
                    bgcolor: formData.role === 'CLIENT' ? '#f0fdf4' : 'white',
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Business sx={{ fontSize: 40, color: '#10b981' }} />
                    {formData.role === 'CLIENT' && (
                      <CheckCircle sx={{ color: '#10b981' }} />
                    )}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    I'm a Client
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Post jobs and hire talented freelancers for your projects
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Paper
                  onClick={() => handleChange({ target: { name: 'role', value: 'FREELANCER' } })}
                  sx={{
                    p: 3,
                    cursor: 'pointer',
                    borderRadius: '16px',
                    border: formData.role === 'FREELANCER' ? '3px solid #6366f1' : '2px solid #e5e7eb',
                    bgcolor: formData.role === 'FREELANCER' ? '#f0f4ff' : 'white',
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Code sx={{ fontSize: 40, color: '#6366f1' }} />
                    {formData.role === 'FREELANCER' && (
                      <CheckCircle sx={{ color: '#6366f1' }} />
                    )}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    I'm a Freelancer
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Find work and showcase your skills to clients worldwide
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={containerStyle}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Container maxWidth="md">
          <Paper 
            elevation={24}
            sx={{ 
              p: { xs: 3, sm: 5 },
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            {/* Logo Section */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    margin: '0 auto',
                    background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(236, 72, 153, 0.4)',
                    mb: 2,
                  }}
                >
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 900 }}>
                    FH
                  </Typography>
                </Box>
              </motion.div>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #ec4899, #f43f5e)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5
                }}
              >
                Join FreelanceHub
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                Create your account and start your journey
              </Typography>
            </Box>
            
            <Stepper 
              activeStep={activeStep} 
              sx={{ 
                mb: 5,
                '& .MuiStepIcon-root.Mui-active': {
                  color: '#ec4899',
                },
                '& .MuiStepIcon-root.Mui-completed': {
                  color: '#10b981',
                },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {error && (
              <Fade in={!!error}>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: '12px',
                  }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              </Fade>
            )}
            
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 4, minHeight: '280px' }}>
                {getStepContent(activeStep)}
              </Box>
              
              <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                <Grid item>
                  {activeStep > 0 && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={handleBack}
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        sx={{
                          borderRadius: '12px',
                          px: 4,
                          py: 1.25,
                          borderWidth: 2,
                          fontWeight: 700,
                          borderColor: '#e5e7eb',
                          '&:hover': {
                            borderColor: '#ec4899',
                            borderWidth: 2,
                          },
                        }}
                      >
                        Back
                      </Button>
                    </motion.div>
                  )}
                </Grid>
                <Grid item>
                  {activeStep < steps.length - 1 ? (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={handleNext}
                        variant="contained"
                        endIcon={<ArrowForward />}
                        sx={{
                          borderRadius: '12px',
                          px: 4,
                          py: 1.25,
                          fontWeight: 700,
                          background: 'linear-gradient(45deg, #ec4899, #f43f5e)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #db2777, #e11d48)',
                          },
                        }}
                      >
                        Continue
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={registerMutation.isPending}
                        sx={{
                          py: 1.75,
                          px: 6,
                          borderRadius: '12px',
                          background: 'linear-gradient(45deg, #ec4899, #f43f5e)',
                          fontSize: '1rem',
                          fontWeight: 700,
                          boxShadow: '0 4px 20px rgba(236, 72, 153, 0.4)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #db2777, #e11d48)',
                            boxShadow: '0 8px 30px rgba(236, 72, 153, 0.5)',
                          },
                        }}
                      >
                        {registerMutation.isPending ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </motion.div>
                  )}
                </Grid>
              </Grid>
            </form>
            
            <Box sx={{ textAlign: 'center', mt: 6, pt: 4, borderTop: '1px solid #e5e7eb' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                Already have an account?
              </Typography>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  sx={{
                    borderRadius: '12px',
                    px: 4,
                    py: 1.25,
                    borderColor: '#ec4899',
                    color: '#ec4899',
                    fontWeight: 700,
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: '#db2777',
                      backgroundColor: 'rgba(236, 72, 153, 0.08)',
                      borderWidth: 2,
                    },
                  }}
                >
                  Sign In Instead
                </Button>
              </motion.div>
            </Box>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="caption" color="text.secondary" align="center" display="block">
                By registering, you agree to our <Link to="/terms" style={{ color: '#ec4899', textDecoration: 'none', fontWeight: 600 }}>Terms</Link> and <Link to="/privacy" style={{ color: '#ec4899', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </motion.div>
    </Box>
  );
};

export default Register;