// FooterComponent.jsx
"use client";
import React from 'react';
import { Box, Grid, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import GoogleIcon from '@mui/icons-material/Google';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import HomeIcon from '@mui/icons-material/Home';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PrintIcon from '@mui/icons-material/Print';

const footer= () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.secondary',
        pt: 4,
        pb: 4,
      }}
      style={{position:'relative',top:'10px',width:'100%'}}
    >
      <Box
        sx={{
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          pb: 3,
          mb: 3,
        }}
      >
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={6} lg={4} textAlign={{ xs: 'center', lg: 'left' }}>
            <Typography variant="body1">
              Get connected with us on social networks:
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={4} textAlign={{ xs: 'center', lg: 'right' }}>
            <IconButton color="inherit" href="#" aria-label="Facebook">
              <FacebookIcon />
            </IconButton>
            <IconButton color="inherit" href="#" aria-label="Twitter">
              <TwitterIcon />
            </IconButton>
            <IconButton color="inherit" href="#" aria-label="Google">
              <GoogleIcon />
            </IconButton>
            <IconButton color="inherit" href="#" aria-label="Instagram">
              <InstagramIcon />
            </IconButton>
            <IconButton color="inherit" href="#" aria-label="LinkedIn">
              <LinkedInIcon />
            </IconButton>
            <IconButton color="inherit" href="#" aria-label="GitHub">
              <GitHubIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              <HomeIcon sx={{ mr: 1  }} style={{position:'relative',top:'5px'}}/>
              New Sagar Computer
            </Typography>
            <Typography variant="body2">
              Here you can use rows and columns to organize your footer content. Lorem ipsum
              dolor sit amet, consectetur adipisicing elit.
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="h6" gutterBottom>
              Products
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="inherit">Laptop</Link>
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="inherit">Reapiring Computer</Link>
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="inherit">Printer</Link>
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="inherit">Accessories</Link>
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="h6" gutterBottom>
              Useful links
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="inherit">Pricing</Link>
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="inherit">Settings</Link>
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="inherit">Orders</Link>
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="inherit">Help</Link>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2">
              <HomeIcon sx={{ mr: 1 }} style={{position:'relative',top:'5px'}}/>
              New Sagar Computer 
            </Typography>
            <Typography variant="body2">
              <EmailIcon sx={{ mr: 1 }} style={{position:'relative',top:'5px'}}/>
              info@example.com
            </Typography>
            <Typography variant="body2">
              <PhoneIcon sx={{ mr: 1 }} style={{position:'relative',top:'5px'}}/>
              + 01 234 567 88
            </Typography>
            <Typography variant="body2">
              <PrintIcon sx={{ mr: 1 }} style={{position:'relative',top:'5px'}}/>
              + 01 234 567 89
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ textAlign: 'center', pt: 4 }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} Copyright: 
          <Link href="https://mdbootstrap.com/" color="inherit">
            MDBootstrap.com
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default footer;
