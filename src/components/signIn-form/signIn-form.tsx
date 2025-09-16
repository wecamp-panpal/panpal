import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function SignInForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <Box>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 4, md: 6, xl: 8 },
          pl: { xs: 2, sm: 6 },
          minWidth: { xs: '100%', sm: 500 },

          minHeight: { xs: 320, sm: 420 },
          borderRadius: 7,
          backgroundColor: '#FDF2E5',
          mx: 'auto',
          boxSizing: 'border-box',
          mt: { md: 9, xl: 'none' },
        }}
      >
        <Stack spacing={2.5}>
          <Box
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            gap={2}
            color={'#FDF2E5'}
          >
            <Typography fontWeight={400} fontSize={{ xs: '1rem', sm: '0.9375rem' }} color="#000">
              Welcome to Panpal
            </Typography>
            <Box>
              <Typography
                fontSize={{ xs: '0.95rem', sm: '0.875rem' }}
                display="block"
                mb={0.5}
                color="#000"
              >
                No Account?
              </Typography>
              <Link
                to="/sign-up"
                style={{ color: 'primary', textDecoration: 'underline', fontWeight: 400 }}
              >
                Sign up
              </Link>
            </Box>
          </Box>
          <Typography fontSize={{ xs: '1.3rem', sm: '1.875rem' }} fontWeight={600}>
            Log In
          </Typography>
          <Typography color="#737373" fontSize={{ xs: '0.95rem', sm: '1rem' }}>
            Please enter your credentials to sign in
          </Typography>
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
              width: '100%',
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
                width: '100%',
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
            color="primary"
            fontSize="0.875rem"
            display="flex"
            justifyContent="end"
            alignItems="center"
            gap="0.3125rem"
            style={{ cursor: 'pointer' }}
          >
            Forgot password?
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center" gap={0} width="100%">
            <Button
              type="submit"
              variant="contained"
              style={{ background: 'primary', borderRadius: '12px' }}
              disabled={loading}
              onClick={handleSignIn}
              fullWidth
            >
              <Box display="flex" alignItems="center" gap="0.3125rem" padding={'0.5rem 1rem'}>
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
              sx={{ mt: 1, mb: 1 }}
            >
              OR
            </Typography>
            <Button
              type="button"
              variant="contained"
              style={{ background: '#836751', borderRadius: '12px' }}
              disabled={loading}
              onClick={handleSignInWithGoogle}
              fullWidth
            >
              <Box display="flex" alignItems="center" gap={2} padding={'0.5rem 1rem'}>
                <img src="/google-logo.svg" width={24} height={24} alt="google-logo" />
                <Typography fontWeight={600} color="#fffff6">
                  Log in with Google
                </Typography>
              </Box>
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
