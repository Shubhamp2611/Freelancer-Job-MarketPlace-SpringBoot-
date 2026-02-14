/* eslint-disable no-unused-vars */
// src/components/common/Header.js
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Chip,
  Tooltip,
  alpha,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Work,
  Description,
  Person,
  Dashboard,
  ExitToApp,
  Notifications,
  Mail,
  Add,
  Search,
  Brightness4,
  Brightness7,
  AccountCircle,
  Settings,
  Paid,
  Business,
  Code,
  Login,
  HowToReg,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/userSlice';

const Header = ({ toggleTheme, mode }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Safely get auth state from Redux
  const reduxState = useSelector((state) => state);
  const user = reduxState?.user?.user || null;
  const isAuthenticated = reduxState?.user?.isAuthenticated || !!localStorage.getItem('token');

  useEffect(() => {
    // Fetch notifications (simulated)
    const mockNotifications = [
      { id: 1, title: 'New Proposal Received', message: 'John sent a proposal for your project', time: '5 min ago', read: false, type: 'proposal' },
      { id: 2, title: 'Contract Approved', message: 'Your contract has been approved', time: '1 hour ago', read: false, type: 'contract' },
      { id: 3, title: 'Payment Received', message: 'Payment of $500 has been received', time: '2 hours ago', read: true, type: 'payment' },
    ];
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleClose();
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNotifications = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClick = (notification) => {
    const updatedNotifications = notifications.map(n =>
      n.id === notification.id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    setUnreadCount(prev => prev - 1);
    setNotificationAnchor(null);

    switch (notification.type) {
      case 'proposal':
        navigate('/my-proposals');
        break;
      case 'contract':
        navigate('/contracts');
        break;
      case 'payment':
        navigate('/profile?tab=payments');
        break;
      default:
        break;
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'ADMIN':
        return <Dashboard fontSize="small" />;
      case 'CLIENT':
        return <Business fontSize="small" />;
      case 'FREELANCER':
        return <Code fontSize="small" />;
      default:
        return <Person fontSize="small" />;
    }
  };

  // Common navigation items for all users
  const commonNavItems = [
    { text: 'Home', path: '/', icon: <Home /> },
    { text: 'Jobs', path: '/jobs', icon: <Work /> },
    { text: 'Contracts', path: '/contracts', icon: <Description /> },
  ];

  // Role-specific navigation items
  const roleSpecificItems = [];
  
  if (isAuthenticated) {
    if (user?.role === 'CLIENT') {
      roleSpecificItems.push({ 
        text: 'Post Job', 
        path: '/jobs/create', 
        icon: <Add />,
        variant: 'contained',
        color: 'secondary'
      });
    }
    
    if (user?.role === 'FREELANCER') {
      roleSpecificItems.push({ 
        text: 'My Proposals', 
        path: '/my-proposals', 
        icon: <Description /> 
      });
    }
    
    if (user?.role === 'ADMIN') {
      roleSpecificItems.push({ 
        text: 'Admin Dashboard', 
        path: '/admin', 
        icon: <Dashboard /> 
      });
    }
  }

  // Combine navigation items
  const navItems = [...commonNavItems, ...roleSpecificItems];

  const drawer = (
    <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" fontWeight="bold">
          Freelance Marketplace
        </Typography>
        <Typography variant="caption">
          Secure Freelancing Platform
        </Typography>
      </Box>
      
      {isAuthenticated && user && (
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Avatar sx={{ width: 48, height: 48, bgcolor: 'secondary.main' }}>
            {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="subtitle1" fontWeight="bold" noWrap>
              {user.name || 'User'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {getRoleIcon(user.role)}
              <Typography variant="caption" color="text.secondary" noWrap>
                {user.role?.toLowerCase()}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      <List sx={{ flex: 1, p: 1 }}>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                }
              }
            }}
          >
            <ListItemIcon sx={{ 
              color: location.pathname === item.path ? 'primary.main' : 'inherit',
              minWidth: 40
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 'bold' : 'normal'
              }}
            />
          </ListItem>
        ))}
      </List>

      <Divider />
      
      <List sx={{ p: 1 }}>
        {isAuthenticated ? (
          <>
            <ListItem
              button
              component={Link}
              to="/profile"
              onClick={handleDrawerToggle}
              selected={location.pathname === '/profile'}
            >
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </ListItem>
            
            {user?.role === 'FREELANCER' && (
              <ListItem
                button
                component={Link}
                to="/profile?tab=payments"
                onClick={handleDrawerToggle}
              >
                <ListItemIcon>
                  <Paid />
                </ListItemIcon>
                <ListItemText primary="My Earnings" />
              </ListItem>
            )}
            
            <ListItem button onClick={toggleTheme}>
              <ListItemIcon>
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </ListItemIcon>
              <ListItemText primary={mode === 'dark' ? 'Light Mode' : 'Dark Mode'} />
            </ListItem>
            
            <Divider sx={{ my: 1 }} />
            
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp color="error" />
              </ListItemIcon>
              <ListItemText primary="Logout" primaryTypographyProps={{ color: 'error' }} />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={Link} to="/login" onClick={handleDrawerToggle}>
              <ListItemIcon>
                <Login />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/register" onClick={handleDrawerToggle}>
              <ListItemIcon>
                <HowToReg />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={1}
        sx={{ 
          backgroundColor: theme.palette.mode === 'dark' ? 
            alpha(theme.palette.background.paper, 0.9) : 
            'background.paper',
          color: 'text.primary',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            <Work color="primary" sx={{ fontSize: { xs: 24, sm: 28 } }} />
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              Freelance Marketplace
            </Box>
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              FM
            </Box>
          </Typography>

          {/* Desktop Navigation - ONLY SHOW WHEN LOGGED IN */}
          {isAuthenticated && (
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5 }}>
              {navItems.map((item) => (
                item.variant === 'contained' ? (
                  <Button
                    key={item.text}
                    variant="contained"
                    color="secondary"
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                    size="small"
                    sx={{ 
                      ml: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: 2,
                      fontSize: '0.875rem'
                    }}
                  >
                    {item.text}
                  </Button>
                ) : (
                  <Button
                    key={item.text}
                    color="inherit"
                    component={Link}
                    to={item.path}
                    sx={{ 
                      mx: 0.5,
                      color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                      fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                      borderBottom: location.pathname === item.path ? 
                        `2px solid ${theme.palette.primary.main}` : 'none',
                      borderRadius: 0,
                      fontSize: '0.9rem',
                      minWidth: 'auto',
                      px: 1.5
                    }}
                  >
                    {item.text}
                  </Button>
                )
              ))}
            </Box>
          )}

          {/* Right Side Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 2 }}>
            {/* Theme Toggle */}
            <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
              <IconButton onClick={toggleTheme} color="inherit" size="small">
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>

            {/* NOT SHOW LOGIN/REGISTER WHEN LOGGED IN */}
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Tooltip title="Notifications">
                  <IconButton
                    color="inherit"
                    onClick={handleNotifications}
                    size="small"
                  >
                    <Badge badgeContent={unreadCount} color="error" max={9}>
                      <Notifications />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {/* User Role Chip */}
                {user?.role && (
                  <Chip
                    icon={getRoleIcon(user.role)}
                    label={user.role?.toLowerCase()}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ 
                      display: { xs: 'none', md: 'flex' },
                      height: 28,
                      '& .MuiChip-icon': { ml: 0.5 }
                    }}
                  />
                )}

                {/* User Avatar/Menu */}
                <Tooltip title="Account menu">
                  <IconButton
                    onClick={handleMenu}
                    color="inherit"
                    size="small"
                    sx={{ p: 0.5 }}
                  >
                    <Avatar sx={{ 
                      width: 36, 
                      height: 36,
                      bgcolor: 'secondary.main',
                      border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      fontSize: '0.9rem'
                    }}>
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              // ONLY SHOW LOGIN/REGISTER WHEN NOT LOGGED IN
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  startIcon={<Login />}
                  sx={{ 
                    textTransform: 'none',
                    borderRadius: 2,
                    fontSize: '0.875rem'
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/register"
                  startIcon={<HowToReg />}
                  sx={{ 
                    ml: 1,
                    textTransform: 'none',
                    borderRadius: 2,
                    boxShadow: 2,
                    fontSize: '0.875rem'
                  }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            border: 'none'
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={() => setNotificationAnchor(null)}
        PaperProps={{
          sx: { 
            width: 320,
            maxHeight: 400,
            borderRadius: 2,
            mt: 1,
            boxShadow: theme.shadows[3]
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Button 
                size="small" 
                onClick={markAllAsRead}
                sx={{ textTransform: 'none' }}
              >
                Mark all as read
              </Button>
            )}
          </Box>
        </Box>
        
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem 
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              sx={{ 
                py: 1.5,
                borderLeft: notification.read ? 'none' : `3px solid ${theme.palette.primary.main}`
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {notification.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.time}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {notification.message}
                </Typography>
              </Box>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ width: '100%', py: 2 }}>
              No notifications
            </Typography>
          </MenuItem>
        )}
        
        <Divider />
        <MenuItem component={Link} to="/notifications" onClick={() => setNotificationAnchor(null)}>
          <Typography variant="body2" color="primary" align="center" sx={{ width: '100%' }}>
            View all notifications
          </Typography>
        </MenuItem>
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { 
            width: 220,
            mt: 1,
            borderRadius: 2,
            boxShadow: theme.shadows[3]
          }
        }}
      >
        {isAuthenticated && user && (
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" fontWeight="bold" noWrap>
              {user.name || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user.email}
            </Typography>
          </Box>
        )}
        
        <MenuItem component={Link} to="/profile" onClick={handleClose}>
          <Person sx={{ mr: 2, fontSize: 20 }} /> Profile
        </MenuItem>
        
        {isAuthenticated && user?.role === 'FREELANCER' && (
          <MenuItem component={Link} to="/profile?tab=payments" onClick={handleClose}>
            <Paid sx={{ mr: 2, fontSize: 20 }} /> My Earnings
          </MenuItem>
        )}
        
        <MenuItem component={Link} to="/settings" onClick={handleClose}>
          <Settings sx={{ mr: 2, fontSize: 20 }} /> Settings
        </MenuItem>
        
        <Divider sx={{ my: 1 }} />
        
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ExitToApp sx={{ mr: 2, fontSize: 20 }} /> Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;