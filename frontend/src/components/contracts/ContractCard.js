import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  CardActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ContractCard = ({ contract }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'COMPLETED':
        return 'info';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="div" noWrap>
            {contract.title}
          </Typography>
          <Chip
            label={contract.status}
            color={getStatusColor(contract.status)}
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {contract.description?.substring(0, 100)}...
        </Typography>

        <Box sx={{ mb: 1 }}>
          <Typography variant="body2">
            <strong>Budget:</strong> ${contract.totalAmount}
          </Typography>
          <Typography variant="body2">
            <strong>Freelancer:</strong> {contract.freelancerName}
          </Typography>
          <Typography variant="body2">
            <strong>Start Date:</strong> {new Date(contract.startDate).toLocaleDateString()}
          </Typography>
        </Box>

        {contract.milestones && (
          <Typography variant="body2" color="text.secondary">
            <strong>Milestones:</strong> {contract.milestones.length}
          </Typography>
        )}
      </CardContent>

      <CardActions>
        <Button size="small" onClick={() => navigate(`/contracts/${contract.id}`)}>
          View Details
        </Button>
        {contract.status === 'PENDING' && (
          <Button size="small" color="primary" onClick={() => navigate(`/contracts/${contract.id}/fund`)}>
            Fund Escrow
          </Button>
        )}
        {contract.status === 'ACTIVE' && (
          <Button size="small" color="success" onClick={() => navigate(`/contracts/${contract.id}/complete`)}>
            Complete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ContractCard;