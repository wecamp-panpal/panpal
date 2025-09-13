import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from '../components/nav-bar/nav-bar';
import Footer from '../components/footer/footer';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Dummy sign-in logic, replace with real API call if available
    if (email === 'user@example.com' && password === 'password') {
      setError('');
      navigate('/'); // Redirect to home or dashboard
    } else {
      setError('Incorrect email or password!');
    }
    setLoading(false);
  };

  const handleSignInWithGoogle = () => {
    window.open('https://your-api-url/auth/google', '_self');
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <NavBar />
      <Box flex={1} display="flex" justifyContent="center" alignItems="center">
        <Paper elevation={3} sx={{ p: 4, minWidth: 350 }}>
          <Stack spacing={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={400} fontSize="0.9375rem" color="#000">
                Welcome Back to Recipe Club
              </Typography>
              <Typography fontSize="0.875rem" display="flex" gap="0.3125rem">
                No Account?{' '}
                <Link
                  to="/signup"
                  style={{ color: '#FF885B', textDecoration: 'underline', fontWeight: 600 }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
            <Typography fontSize="1.875rem" fontWeight={600}>
              Sign in
            </Typography>
            <Typography color="#737373">Please enter your credentials to sign in</Typography>
            <TextField
              label="Email / Username"
              placeholder="Enter your email or username"
              type="text"
              fullWidth
              value={email}
              onChange={e => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <span role="img" aria-label="user">
                      👤
                    </span>
                  </InputAdornment>
                ),
              }}
            />
            <Tooltip
              title={
                <Typography variant="body2">
                  Password must contain at least 1 letter, 1 number, and allows special characters
                </Typography>
              }
              arrow
            >
              <TextField
                label="Password"
                placeholder="Enter your password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={password}
                onChange={e => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span role="img" aria-label="lock">
                        🔒
                      </span>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Tooltip>
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Typography
              color="#FF885B"
              fontSize="0.875rem"
              display="flex"
              justifyContent="end"
              alignItems="center"
              gap="0.3125rem"
              style={{ cursor: 'pointer' }}
            >
              Forgot password?
            </Typography>
            <Button
              type="submit"
              variant="contained"
              style={{ background: '#FF885B' }}
              disabled={loading}
              onClick={handleSignIn}
            >
              <Box display="flex" alignItems="center" gap="0.3125rem">
                <Typography fontWeight={600} color="#fffff6">
                  Sign in
                </Typography>
              </Box>
            </Button>
            <Typography
              color="#ABABAB"
              alignItems="center"
              fontSize="0.875rem"
              display="flex"
              justifyContent="center"
              width="100%"
              textAlign="center"
              margin="0.25rem 0"
            >
              OR
            </Typography>
            <Button
              type="button"
              variant="contained"
              style={{ background: '#FF885B' }}
              disabled={loading}
              onClick={handleSignInWithGoogle}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <img src="/icons/google-logo.svg" width={24} height={24} alt="google-logo" />
                <Typography fontWeight={600} color="#fffff6">
                  Sign in with Google
                </Typography>
              </Box>
            </Button>
          </Stack>
        </Paper>
      </Box>
      <Footer />
    </Box>
  );
};

export default SignInPage;
