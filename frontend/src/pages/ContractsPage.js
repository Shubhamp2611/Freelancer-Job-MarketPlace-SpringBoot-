import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ContractList from '../components/contracts/ContractList';

const ContractsPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Contracts
        </Typography>
        <ContractList />
      </Box>
    </Container>
  );
};

export default ContractsPage;