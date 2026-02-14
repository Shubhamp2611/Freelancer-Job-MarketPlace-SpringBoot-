import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import { Refresh, BugReport } from '@mui/icons-material';

const DebugInfo = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  
  const debugInfo = {
    'User Data': JSON.stringify(user, null, 2),
    'Token Exists': token ? 'Yes' : 'No',
    'Token Length': token ? token.length : 0,
    'Token Preview': token ? `${token.substring(0, 20)}...` : 'None',
    'API Base URL': process.env.REACT_APP_API_URL || 'http://localhost:10000/api',
    'Environment': process.env.NODE_ENV,
    'User Agent': navigator.userAgent,
  };

  const clearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  const copyToClipboard = () => {
    const debugText = Object.entries(debugInfo)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    
    navigator.clipboard.writeText(debugText);
    alert('Debug info copied to clipboard!');
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">
          <BugReport sx={{ mr: 1, verticalAlign: 'middle' }} />
          Debug Information
        </Typography>
        <Chip 
          label="Development Only" 
          color="warning" 
          size="small"
        />
      </Box>
      
      <List dense>
        {Object.entries(debugInfo).map(([key, value]) => (
          <ListItem key={key}>
            <ListItemText
              primary={key}
              secondary={
                <Box component="pre" sx={{ 
                  mt: 1, 
                  p: 1, 
                  bgcolor: 'grey.50', 
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  overflow: 'auto'
                }}>
                  {value}
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => window.location.reload()}
          size="small"
        >
          Refresh Page
        </Button>
        <Button
          variant="outlined"
          onClick={clearStorage}
          size="small"
        >
          Clear Storage
        </Button>
        <Button
          variant="contained"
          onClick={copyToClipboard}
          size="small"
        >
          Copy Debug Info
        </Button>
      </Box>
    </Paper>
  );
};

export default DebugInfo;