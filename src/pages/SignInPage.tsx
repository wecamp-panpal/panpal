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
      <Box display="flex" flexDirection="row">
        <Box flex={2} display={'flex'} justifyContent="center" alignItems="center">
          <img src="public/signin_img.svg" alt="Panpal Logo" />
        </Box>
        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          color={'#FDF2E5'}
          padding={'2rem'}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              pl: 6,
              minWidth: 450,
              minHeight: 700,
              borderRadius: 7,
              backgroundColor: '#FDF2E5',
            }}
          >
            <Stack spacing={3}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                color={'#FDF2E5'}
              >
                <Typography fontWeight={400} fontSize="0.9375rem" color="#000">
                  Welcome to Panpal
                </Typography>
                <Box>
                  <Typography fontSize="0.875rem" display="block" mb={0.5} color="#000">
                    No Account?
                  </Typography>
                  <Link
                    to="/sign-up"
                    style={{ color: '#FF885B', textDecoration: 'underline', fontWeight: 400 }}
                  >
                    Sign up
                  </Link>
                </Box>
              </Box>
              <Typography fontSize="1.875rem" fontWeight={600}>
                Log In
              </Typography>
              <Typography color="#737373">Please enter your credentials to sign in</Typography>
              <TextField
                label="Email / Username"
                placeholder="Enter your email or username"
                type="text"
                fullWidth
                value={email}
                onChange={e => setEmail(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#F5E2CC !important',
                    '&.Mui-disabled': {
                      backgroundColor: '#F5E2CC !important',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(0, 0, 0, 0.6)',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'rgba(0, 0, 0, 0.6)',
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#000',
                  },
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
                  autoComplete="false"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#F5E2CC !important',
                      '&.Mui-disabled': {
                        backgroundColor: '#F5E2CC !important',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                      },
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'rgba(0, 0, 0, 0.6)',
                    },
                    '& .MuiOutlinedInput-input': {
                      color: '#000',
                    },
                  }}
                  InputProps={{
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
                style={{ background: 'primary', borderRadius: '12px',}}
                disabled={loading}
                onClick={handleSignIn}
              >
                <Box display="flex" alignItems="center" gap="0.3125rem" padding={'0.5rem 1rem'} >
                  <Typography fontWeight={600} color="#fffff6">
                    Log in
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
                style={{ background: '#836751', borderRadius: '12px' }}
                disabled={loading}
                onClick={handleSignInWithGoogle}
              >
                <Box display="flex" alignItems="center" gap={2} padding={'0.5rem 1rem'}>
                  <img src="/public/google-logo.svg" width={24} height={24} alt="google-logo" />
                  <Typography fontWeight={600} color="#fffff6">
                    Log in with Google
                  </Typography>
                </Box>
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default SignInPage;
