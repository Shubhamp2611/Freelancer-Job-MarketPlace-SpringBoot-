/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { CheckCircle, Error, Warning, ExpandMore } from '@mui/icons-material';

const ConnectionTest = () => {
  const initialTests = [
    { name: 'Backend Server', status: 'pending', message: 'Not tested yet', details: '' },
    { name: 'Authentication API', status: 'pending', message: 'Not tested yet', details: '' },
    { name: 'Jobs API', status: 'pending', message: 'Not tested yet', details: '' },
    { name: 'Profile API', status: 'pending', message: 'Not tested yet', details: '' },
  ];

  const [tests, setTests] = useState(initialTests);
  const [running, setRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState('pending');

  const updateTest = (index, status, message, details = '') => {
    setTests(prevTests => {
      const newTests = [...prevTests];
      newTests[index] = { ...newTests[index], status, message, details };
      return newTests;
    });
  };

  const runTests = async () => {
    setRunning(true);
    setTests(initialTests);
    setOverallStatus('running');

    // Test 1: Backend Server
    try {
      const response = await fetch('http://localhost:10000/api/health');
      const data = await response.json();
      updateTest(0, 'success', 'Backend is running', 
        `Status: ${response.status}\nResponse: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      updateTest(0, 'error', `Cannot connect: ${error.message}`,
        `Error: ${error.toString()}\nMake sure Spring Boot is running on port 8080.`);
    }

    // Test 2: Authentication API
    try {
      const response = await fetch('http://localhost:10000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@marketplace.com',
          password: 'admin123'
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        updateTest(1, 'success', 'Login successful', 
          `Status: ${response.status}\nToken received: ${data.accessToken ? 'Yes' : 'No'}`);
      } else {
        updateTest(1, 'error', `Login failed: ${response.status}`, 
          `Response: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      updateTest(1, 'error', `Login error: ${error.message}`,
        `Check if endpoint /api/auth/login exists\nError: ${error.toString()}`);
    }

    // Test 3: Jobs API
    try {
      const response = await fetch('http://localhost:10000/api/jobs/open');
      const data = await response.json();
      
      if (response.ok) {
        updateTest(2, 'success', `Jobs API working (${data.length || 0} jobs found)`,
          `Status: ${response.status}\nEndpoint: /api/jobs/open`);
      } else {
        updateTest(2, 'error', `Jobs API error: ${response.status}`,
          `Response: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      updateTest(2, 'error', `Jobs API error: ${error.message}`,
        `Check if endpoint /api/jobs/open exists\nError: ${error.toString()}`);
    }

    // Test 4: Profile API (needs authentication)
    try {
      // First login to get token
      const loginResponse = await fetch('http://localhost:10000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@marketplace.com',
          password: 'admin123'
        })
      });
      
      if (!loginResponse.ok) {
        updateTest(3, 'error', 'Cannot get auth token: Login failed',
          `Status: ${loginResponse.status}\nTry logging in manually first.`);
        return;
      }

      const loginData = await loginResponse.json();
      
      if (!loginData.accessToken) {
        updateTest(3, 'error', 'No access token in response',
          `Response: ${JSON.stringify(loginData, null, 2)}`);
        return;
      }

      // Now test profile endpoint with token
      const profileResponse = await fetch('http://localhost:10000/api/profile/me', {
        headers: {
          'Authorization': `Bearer ${loginData.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      const profileData = await profileResponse.json();
      
      if (profileResponse.ok) {
        updateTest(3, 'success', 'Profile API working',
          `Status: ${profileResponse.status}\nUser: ${profileData.name} (${profileData.email})`);
      } else {
        updateTest(3, 'error', `Profile API error: ${profileResponse.status}`,
          `Response: ${JSON.stringify(profileData, null, 2)}`);
      }
    } catch (error) {
      updateTest(3, 'error', `Profile API error: ${error.message}`,
        `Error: ${error.toString()}`);
    }

    setRunning(false);
    
    // Calculate overall status
    const finalTests = [...tests];
    const failed = finalTests.filter(t => t.status === 'error').length;
    const passed = finalTests.filter(t => t.status === 'success').length;
    
    if (failed > 0) {
      setOverallStatus('error');
    } else if (passed === finalTests.length) {
      setOverallStatus('success');
    } else {
      setOverallStatus('warning');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle />;
      case 'error': return <Error />;
      case 'warning': return <Warning />;
      default: return null;
    }
  };

  const handleRetry = () => {
    runTests();
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Backend Connection Test
        </Typography>
        
        <Typography variant="body1" paragraph>
          This page tests the connection between your React frontend and Spring Boot backend.
          Run these tests to identify any connectivity issues.
        </Typography>
        
        {running && (
          <Box sx={{ mb: 3 }}>
            <LinearProgress />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Running tests...
            </Typography>
          </Box>
        )}
        
        <List>
          {tests.map((test, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={test.name}
                  secondary={test.message}
                />
                <Chip
                  icon={getStatusIcon(test.status)}
                  label={test.status.toUpperCase()}
                  color={getStatusColor(test.status)}
                  variant="outlined"
                  sx={{ minWidth: '100px' }}
                />
              </ListItem>
              {test.details && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="caption">Details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box component="pre" sx={{ 
                      bgcolor: 'grey.50', 
                      p: 2, 
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {test.details}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              )}
            </React.Fragment>
          ))}
        </List>
        
        <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            onClick={runTests}
            disabled={running}
          >
            {running ? 'Testing...' : 'Run All Tests'}
          </Button>
          
          <Button
            variant="outlined"
            onClick={handleRetry}
            disabled={running}
          >
            Retry Tests
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => window.location.href = '/'}
          >
            Back to Dashboard
          </Button>
        </Box>
        
        {overallStatus !== 'pending' && !running && (
          <Alert 
            severity={overallStatus} 
            sx={{ mt: 3 }}
            action={
              overallStatus === 'error' && (
                <Button color="inherit" size="small" onClick={handleRetry}>
                  RETRY
                </Button>
              )
            }
          >
            {overallStatus === 'success' 
              ? '✅ All tests passed! Your backend connection is working correctly.'
              : overallStatus === 'error'
              ? '❌ Some tests failed. Check the details above for specific issues.'
              : '⚠️ Some tests have warnings. Review the results above.'}
          </Alert>
        )}
        
        <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Manual Test URLs
          </Typography>
          <Typography variant="body2" paragraph>
            You can manually test these endpoints in your browser:
          </Typography>
          <ul style={{ paddingLeft: '20px' }}>
            <li><a href="http://localhost:10000/api/health" target="_blank" rel="noopener noreferrer">http://localhost:10000/api/health</a></li>
            <li><a href="http://localhost:10000/api/jobs/open" target="_blank" rel="noopener noreferrer">http://localhost:10000/api/jobs/open</a></li>
          </ul>
        </Box>
      </Paper>
    </Container>
  );
};

export default ConnectionTest;