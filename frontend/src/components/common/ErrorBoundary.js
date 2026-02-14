// src/components/common/ErrorBoundary.js
import React, { Component } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Refresh,
  Home,
  BugReport,
  ReportProblem,
  ArrowBack,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // You can send error to your backend here
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              borderRadius: 3,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              textAlign: 'center',
            }}
          >
            <Box sx={{ mb: 4 }}>
              <ReportProblem 
                sx={{ 
                  fontSize: 80, 
                  color: 'error.main',
                  mb: 2 
                }} 
              />
              <Typography variant="h4" gutterBottom color="error">
                Oops! Something went wrong
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                We apologize for the inconvenience. Our team has been notified and is working to fix the issue.
              </Typography>
            </Box>

            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center"
              sx={{ mb: 4 }}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<Refresh />}
                onClick={this.handleReset}
                size="large"
              >
                Try Again
              </Button>
              
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Home />}
                component={Link}
                to="/"
                size="large"
              >
                Go to Home
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => window.history.back()}
                size="large"
              >
                Go Back
              </Button>
            </Stack>

            {/* Error Details (Visible in development) */}
            {process.env.NODE_ENV === 'development' && (
              <Paper 
                variant="outlined" 
                sx={{ 
                  mt: 4, 
                  p: 3, 
                  textAlign: 'left',
                  bgcolor: 'grey.50',
                  maxHeight: 300,
                  overflow: 'auto'
                }}
              >
                <Typography variant="h6" gutterBottom color="error">
                  <BugReport sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Error Details (Development Only)
                </Typography>
                <Typography variant="body2" component="pre" sx={{ 
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {this.state.error && this.state.error.toString()}
                </Typography>
                <Typography variant="body2" component="pre" sx={{ 
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  mt: 2
                }}>
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </Typography>
                
                <Button
                  variant="text"
                  size="small"
                  onClick={() => {
                    const errorDetails = `Error: ${this.state.error}\n\nStack: ${this.state.errorInfo?.componentStack}`;
                    navigator.clipboard.writeText(errorDetails);
                    alert('Error details copied to clipboard!');
                  }}
                  sx={{ mt: 2 }}
                >
                  Copy Error Details
                </Button>
              </Paper>
            )}

            {/* Contact Support */}
            <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                If the problem persists, please contact our support team
              </Typography>
              <Button
                variant="text"
                color="primary"
                href="mailto:support@freelancepro.com"
                sx={{ mt: 1 }}
              >
                Contact Support
              </Button>
            </Box>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components
export const withErrorBoundary = (WrappedComponent) => {
  return class extends ErrorBoundary {
    render() {
      if (this.state.hasError) {
        return super.render();
      }
      return <WrappedComponent {...this.props} />;
    }
  };
};

export default ErrorBoundary;