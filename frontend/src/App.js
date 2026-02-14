import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import store from './store/store';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';

// Page Components
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import JobsPage from './pages/JobsPage';
import ContractsPage from './pages/ContractsPage';
import ProfilePage from './pages/ProfilePage';
import ConnectionTest from './pages/ConnectionTest';
import MyProposalsPage from './pages/MyProposalsPage';

// Job Components
import CreateJob from './components/jobs/CreateJob';
import JobDetails from './components/jobs/JobDetails';

// Contract Components
import ContractList from './components/contracts/ContractList';
import CreateContract from './components/contracts/CreateContract';
import ContractDetails from './components/contracts/ContractDetails';
import CompleteContract from './components/contracts/CompleteContract';
import FundEscrow from './components/contracts/FundEscrow';

// Proposal Components
import CreateProposal from './components/proposals/CreateProposal';

// Payment Components
import EscrowPayment from './components/payments/EscrowPayment';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <Router>
            <div className="App" style={{ 
              minHeight: '100vh', 
              display: 'flex', 
              flexDirection: 'column',
              backgroundColor: '#f5f5f5'
            }}>
              <Header />
              <main style={{ flex: 1, padding: '20px' }}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/connection-test" element={<ConnectionTest />} />
                  
                  {/* Protected Routes */}
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/client" element={
                    <ProtectedRoute allowedRoles={['CLIENT']}>
                      <ClientDashboard />
                    </ProtectedRoute>
                  } />

                  <Route path="/freelancer" element={
                    <ProtectedRoute allowedRoles={['FREELANCER']}>
                      <FreelancerDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/jobs" element={
                    <ProtectedRoute>
                      <JobsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/jobs/create" element={
                    <ProtectedRoute allowedRoles={['CLIENT']}>
                      <CreateJob />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/jobs/:id" element={
                    <ProtectedRoute>
                      <JobDetails />
                    </ProtectedRoute>
                  } />

                  <Route path="/jobs/:jobId/propose" element={
                    <ProtectedRoute allowedRoles={['FREELANCER']}>
                      <CreateProposal />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/contracts" element={
                    <ProtectedRoute>
                      <ContractsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/contracts/:id" element={
                    <ProtectedRoute>
                      <ContractDetails />
                    </ProtectedRoute>
                  } />

                  <Route path="/contracts/:id/fund" element={
                    <ProtectedRoute>
                      <FundEscrow />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/contracts/:id/complete" element={
                    <ProtectedRoute>
                      <CompleteContract />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/proposals/:proposalId/create-contract" element={
                    <ProtectedRoute allowedRoles={['CLIENT']}>
                      <CreateContract />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/contracts/:contractId/fund-escrow" element={
                    <ProtectedRoute allowedRoles={['CLIENT']}>
                      <EscrowPayment />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/my-proposals" element={
                    <ProtectedRoute>
                      <MyProposalsPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* 404 Route */}
                  <Route path="*" element={
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                      <h1>404 - Page Not Found</h1>
                      <p>The page you are looking for does not exist.</p>
                    </div>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;