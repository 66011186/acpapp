import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Paper, Box } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Link from 'next/link';  // Import Next.js Link

export default function Login() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#1c1c1e',
        color: 'white',
      }}
    >
      {/* Navigation */}
      <Box sx={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Logo</Typography>
        <Box>
          <Link href="#" passHref>
            <Button sx={{ color: 'white', marginRight: '16px' }}>Report</Button>
          </Link>
          <Link href="#" passHref>
            <Button sx={{ color: 'white', marginRight: '16px' }}>Conclusion</Button>
          </Link>
          <Link href="#" passHref>
            <Button sx={{ color: 'white', marginRight: '16px' }}>Community</Button>
          </Link>
          <Link href="#" passHref>
            <Button sx={{ color: 'white', marginRight: '16px' }}>Environment</Button>
          </Link>
          <Link href="#" passHref>
            <Button sx={{ color: 'white', marginRight: '16px' }}>Contact</Button>
          </Link>
          <Link href="/login" passHref>
            <Button sx={{ color: 'white', border: '1px solid white', marginRight: '8px' }}>Sign in</Button>
          </Link>
          <Link href="/signup" passHref>
            <Button variant="contained" sx={{ backgroundColor: 'white', color: 'black' }}>Register</Button>
          </Link>
        </Box>
      </Box>

      {/* Login Section */}
      <Grid container justifyContent="center" alignItems="center" sx={{ flexGrow: 1 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ padding: '30px', backgroundColor: '#333', color: 'white' }}>
            <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
              Log in
            </Typography>
            <form onSubmit={handleLoginSubmit}>
              <TextField
                fullWidth
                label="Name"
                variant="filled"
                margin="normal"
                InputLabelProps={{ style: { color: 'white' } }}
                sx={{ input: { color: 'white' }, backgroundColor: '#1c1c1e' }}
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <TextField
                fullWidth
                label="Password"
                variant="filled"
                margin="normal"
                type="password"
                InputLabelProps={{ style: { color: 'white' } }}
                sx={{ input: { color: 'white' }, backgroundColor: '#1c1c1e' }}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <Link href="#" passHref>
                <Typography variant="body2" sx={{ color: 'red', display: 'block', marginBottom: '16px' }}>
                  Forget password?
                </Typography>
              </Link>
              <Button variant="contained" color="primary" fullWidth type="submit" sx={{ marginBottom: '16px' }}>
                Log in
              </Button>
              <Typography variant="body2" align="center">
                Don’t have an account? Let’s{' '}
                <Link href="/signup" sx={{ color: 'white' }} passHref>
                  sign up
                </Link>
              </Typography>
            </form>
          </Paper>
        </Grid>
      </Grid>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#333', padding: '40px', display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" color="white">
            © 2023 Your Website
          </Typography>
        </Box>
        <Box>
          <Link href="#" passHref>
            <Button sx={{ color: 'white', marginRight: '16px' }}>
              <i className="fab fa-instagram"></i>
            </Button>
          </Link>
          <Link href="#" passHref>
            <Button sx={{ color: 'white', marginRight: '16px' }}>
              <i className="fab fa-youtube"></i>
            </Button>
          </Link>
          <Link href="#" passHref>
            <Button sx={{ color: 'white', marginRight: '16px' }}>
              <i className="fab fa-linkedin"></i>
            </Button>
          </Link>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
