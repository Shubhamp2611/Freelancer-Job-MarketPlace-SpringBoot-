import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  Fade,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../../api/authAPI';
import { 
  Email,
  CheckCircle,
  ArrowBack,
  Security,
  Send,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const forgotPasswordMutation = useMutation({
    mutationFn: (email) => authAPI.forgotPassword(email),
    onSuccess: () => {
      setSuccess(true);
      setError('');
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Failed to send reset email. Please try again.');
      setSuccess(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    forgotPasswordMutation.mutate(email);
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };

  return (
    <Box sx={containerStyle}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '500px' }}
      >
        <Container maxWidth="sm">
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
                animate={{ 
                  rotate: success ? 360 : 0,
                  scale: success ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 0.6 }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    margin: '0 auto',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                    mb: 2,
                  }}
                >
                  {success ? (
                    <CheckCircle sx={{ fontSize: 48, color: 'white' }} />
                  ) : (
                    <Security sx={{ fontSize: 48, color: 'white' }} />
                  )}
                </Box>
              </motion.div>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #10b981, #059669)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5
                }}
              >
                {success ? 'Check Your Email' : 'Reset Password'}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                {success 
                  ? "We've sent you reset instructions" 
                  : "Enter your email to receive reset instructions"
                }
              </Typography>
            </Box>
            
            {success && (
              <Fade in={success}>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Alert 
                    icon={<CheckCircle fontSize="inherit" />}
                    severity="success" 
                    sx={{ 
                      mb: 3,
                      borderRadius: '12px',
                      bgcolor: '#f0fdf4',
                      color: '#166534',
                      '& .MuiAlert-icon': { 
                        fontSize: '2rem',
                        color: '#10b981',
                      }
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                      Email Sent Successfully!
                    </Typography>
                    <Typography variant="body2">
                      We've sent password reset instructions to <strong>{email}</strong>. Please check your inbox and follow the link.
                    </Typography>
                  </Alert>
                </motion.div>
              </Fade>
            )}
            
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
            
            {!success ? (
              <form onSubmit={handleSubmit}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                  Enter the email address associated with your FreelanceHub account and we'll send you a secure link to reset your password.
                </Typography>
                
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  required
                  disabled={forgotPasswordMutation.isPending}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#10b981' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover fieldset': {
                        borderColor: '#10b981',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10b981',
                      },
                    },
                  }}
                />
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={forgotPasswordMutation.isPending}
                    startIcon={!forgotPasswordMutation.isPending && <Send />}
                    sx={{
                      py: 1.75,
                      mt: 3,
                      mb: 2,
                      borderRadius: '12px',
                      background: 'linear-gradient(45deg, #10b981, #059669)',
                      fontSize: '1rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #059669, #047857)',
                        boxShadow: '0 8px 30px rgba(16, 185, 129, 0.5)',
                      },
                    }}
                  >
                    {forgotPasswordMutation.isPending ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </motion.div>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    This link will expire in 1 hour for security
                  </Typography>
                </Box>
              </form>
            ) : (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Didn't receive the email? Check your spam folder or click below to resend.
                </Typography>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => {
                      setSuccess(false);
                      setEmail('');
                    }}
                    variant="outlined"
                    sx={{
                      borderRadius: '12px',
                      px: 4,
                      py: 1.25,
                      borderColor: '#10b981',
                      color: '#10b981',
                      fontWeight: 700,
                      borderWidth: 2,
                      mb: 2,
                      '&:hover': {
                        borderColor: '#059669',
                        backgroundColor: 'rgba(16, 185, 129, 0.08)',
                        borderWidth: 2,
                      },
                    }}
                  >
                    Try Different Email
                  </Button>
                </motion.div>
              </Box>
            )}
            
            <Box sx={{ textAlign: 'center', mt: 4, pt: 3, borderTop: '1px solid #e5e7eb' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                Remember your password?
              </Typography>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  sx={{
                    borderRadius: '12px',
                    px: 4,
                    py: 1.25,
                    borderColor: '#10b981',
                    color: '#10b981',
                    fontWeight: 700,
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: '#059669',
                      backgroundColor: 'rgba(16, 185, 129, 0.08)',
                      borderWidth: 2,
                    },
                  }}
                >
                  Back to Sign In
                </Button>
              </motion.div>
            </Box>
          </Paper>
        </Container>
      </motion.div>
    </Box>
  );
};

export default ForgotPassword;