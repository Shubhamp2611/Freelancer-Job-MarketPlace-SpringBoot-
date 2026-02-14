/* eslint-disable no-unused-vars */
/* eslint-disable import/first */
// src/components/common/Footer.js
import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  IconButton,
  Divider,
  alpha,
  useTheme,
} from '@mui/material';
import {
  GitHub,
  Email,
  Phone,
  LocationOn,
  Code,
  School,
  Security,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { text: 'How It Works', to: '/how-it-works' },
        { text: 'Find Jobs', to: '/jobs' },
        { text: 'Find Freelancers', to: '/freelancers' },
        { text: 'Pricing', to: '/pricing' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { text: 'Help Center', to: '/help' },
        { text: 'Freelancer Guide', to: '/guide/freelancer' },
        { text: 'Client Guide', to: '/guide/client' },
        { text: 'Blog', to: '/blog' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { text: 'Privacy Policy', to: '/privacy' },
        { text: 'Terms of Service', to: '/terms' },
        { text: 'Escrow Protection', to: '/escrow' },
        { text: 'Dispute Resolution', to: '/disputes' },
      ],
    },
  ];

  // Updated social links with your actual data
  const socialLinks = [
    { 
      icon: <GitHub />, 
      label: 'GitHub', 
      href: 'https://github.com/yourusername/freelance-marketplace',
      description: 'View source code'
    },
    { 
      icon: <Email />, 
      label: 'Email', 
      href: 'mailto:youremail@domain.com',
      description: 'Contact support'
    },
    { 
      icon: <Security />, 
      label: 'Security', 
      to: '/security',
      description: 'Security features'
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.8)
          : theme.palette.grey[50],
        color: theme.palette.text.primary,
        pt: 6,
        pb: 3,
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section - YOUR CREDITS */}
          <Grid item xs={12} md={6} lg={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
              <Code sx={{ verticalAlign: 'middle', mr: 1 }} />
              Freelance Marketplace
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              A full-stack freelancing platform connecting clients with skilled freelancers worldwide. 
              Built with modern technologies to provide secure, efficient, and seamless project collaborations.
            </Typography>
            
            {/* Tech Stack - YOUR TECHNOLOGIES */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" fontWeight="bold" color="text.secondary" display="block" gutterBottom>
                Built With:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                <Chip label="React" size="small" variant="outlined" />
                <Chip label="Spring Boot" size="small" variant="outlined" />
                <Chip label="Material-UI" size="small" variant="outlined" />
                <Chip label="MySQL" size="small" variant="outlined" />
                <Chip label="Redux" size="small" variant="outlined" />
                <Chip label="JWT" size="small" variant="outlined" />
              </Box>
            </Box>
            
            {/* YOUR SOCIAL LINKS */}
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {socialLinks.map((social) => (
                <Tooltip key={social.label} title={social.description} arrow>
                  <IconButton
                    component={social.to ? Link : 'a'}
                    to={social.to}
                    href={social.href}
                    target={social.href ? "_blank" : "_self"}
                    rel={social.href ? "noopener noreferrer" : ""}
                    sx={{
                      color: 'primary.main',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                      }
                    }}
                  >
                    {social.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          </Grid>

          {footerSections.map((section) => (
            <Grid item xs={6} md={3} lg={2} key={section.title}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                {section.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {section.links.map((link) => (
                  <Box component="li" key={link.text} sx={{ mb: 1 }}>
                    <MuiLink
                      component={Link}
                      to={link.to}
                      sx={{
                        color: 'text.secondary',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'underline',
                        }
                      }}
                    >
                      {link.text}
                    </MuiLink>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}

          {/* Contact & Support - YOUR CONTACT INFO */}
          <Grid item xs={12} md={6} lg={4}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Contact & Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email fontSize="small" color="primary" />
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Email Support
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    support@freelancemarketplace.com
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <School fontSize="small" color="primary" />
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Developer
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Your Name/Team Name
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOn fontSize="small" color="primary" sx={{ mt: 0.5 }} />
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Platform Status
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    24/7 Online • Secure • Reliable
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            {/* App Description */}
            <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
              <Typography variant="caption" fontWeight="bold" color="primary" display="block" gutterBottom>
                About This Platform
              </Typography>
              <Typography variant="caption" color="text.secondary">
                A complete freelancing ecosystem with job posting, proposals, contracts, 
                milestone payments, escrow protection, and messaging. Designed for security 
                and ease of use for both clients and freelancers.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Bottom Bar - YOUR CREDITS */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              © {currentYear} Freelance Marketplace. All rights reserved.
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Developed with ❤️ by [Your Name/Team Name]
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-end' } }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Version 1.0.0 • Spring Boot + React Full Stack
            </Typography>
            <Typography variant="caption" color="text.secondary">
              For educational/professional purposes
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

// Add missing import
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';

export default Footer;