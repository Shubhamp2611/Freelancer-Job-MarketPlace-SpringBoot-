import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CircularProgress, Box } from '@mui/material';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.user || { user: null, loading: false });

  useEffect(() => {
    if (!loading && user) {
      switch (user.role) {
        case 'ADMIN':
          navigate('/admin');
          break;
        case 'CLIENT':
          navigate('/client');
          break;
        case 'FREELANCER':
          navigate('/freelancer');
          break;
        default:
          navigate('/');
      }
    }
  }, [user, loading, navigate]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );
};

export default Dashboard;