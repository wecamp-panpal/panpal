import React, { useState, useRef, useLayoutEffect } from 'react';
import {
  Box,
  Button,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  Paper,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from '../components/nav-bar/nav-bar';
import Footer from '../components/footer/footer';

const SignUpPage: React.FC = () => {
  const [focusInput, setFocusInput] = useState<string | null>('firstName');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Dummy form state
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleClickOutside = (event: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(event.target as Node)) {
      setFocusInput(null);
    }
  };

  useLayoutEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Dummy validation
    if (form.password !== form.confirmPassword) {
      setError('Passwords must match');
      setLoading(false);
      return;
    }
    setError('');
    // Simulate success
    navigate('/');
    setLoading(false);
  };

  const handleSignUpWithGoogle = () => {
    window.open('https://your-api-url/auth/google', '_self');
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <NavBar />
      <Box flex={1} display="flex" justifyContent="center" alignItems="center">
        <Paper elevation={3} sx={{ p: 4, minWidth: 400 }}>
          <div ref={formRef}>
            <form onSubmit={handleSubmit}>
              <Stack sx={{ marginBottom: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography fontWeight={400} fontSize="0.9375rem" color="#000">
                    Welcome to Recipe Club
                  </Typography>
                  <Typography fontSize="0.875rem" display="flex" gap={0.5}>
                    Have an Account?{' '}
                    <Link
                      to="/sign-in"
                      style={{ color: '#FF885B', textDecoration: 'underline', fontWeight: 600 }}
                    >
                      Sign in
                    </Link>
                  </Typography>
                </Box>
                <Typography fontSize={30} fontWeight={600}>
                  Sign Up
                </Typography>
              </Stack>
              <Stack gap={1}>
                <Box display="flex" gap={2} sx={{ mb: 2 }}>
                  <Box flex={1}>
                    <TextField
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      disabled={loading}
                      variant="outlined"
                      placeholder="Enter your first name"
                      label="First Name"
                      fullWidth
                      type="text"
                      focused={focusInput === 'firstName'}
                      onFocus={() => setFocusInput('firstName')}
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
                  </Box>
                  <Box flex={1}>
                    <TextField
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      disabled={loading}
                      variant="outlined"
                      placeholder="Enter your last name"
                      label="Last Name"
                      fullWidth
                      type="text"
                      focused={focusInput === 'lastName'}
                      onFocus={() => setFocusInput('lastName')}
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
                  </Box>
                </Box>
                <Box display="flex" gap={2} sx={{ mb: 2 }}>
                  <Box flex={1}>
                    <TextField
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      disabled={loading}
                      variant="outlined"
                      placeholder="Enter your email"
                      label="Email"
                      fullWidth
                      type="email"
                      focused={focusInput === 'email'}
                      onFocus={() => setFocusInput('email')}
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
                  </Box>
                  <Box flex={1}>
                    <TextField
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      disabled={loading}
                      variant="outlined"
                      placeholder="Enter your username"
                      label="Username"
                      fullWidth
                      type="text"
                      focused={focusInput === 'username'}
                      onFocus={() => setFocusInput('username')}
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
                  </Box>
                </Box>
                <Box display="flex" gap={2} sx={{ mb: 3 }}>
                  <Box flex={1}>
                    <Tooltip
                      title={
                        <Typography variant="body2">
                          Password must contain at least 1 letter, 1 number, and allows special
                          characters
                        </Typography>
                      }
                      arrow
                    >
                      <TextField
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        disabled={loading}
                        variant="outlined"
                        placeholder="Enter your password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        focused={focusInput === 'password'}
                        onFocus={() => setFocusInput('password')}
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
                  </Box>
                  <Box flex={1}>
                    <Tooltip
                      title={<Typography variant="body2">Passwords must match</Typography>}
                      arrow
                    >
                      <TextField
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                        variant="outlined"
                        placeholder="Confirm your password"
                        label="Confirm Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        focused={focusInput === 'confirmPassword'}
                        onFocus={() => setFocusInput('confirmPassword')}
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
                  </Box>
                </Box>
                {error && (
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                )}
                <Stack gap={1}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{ backgroundColor: '#FF885B', '&:hover': { backgroundColor: '#ff7a47' } }}
                  >
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Typography fontWeight={600} color="#fffff6">
                        Sign up
                      </Typography>
                    </Box>
                  </Button>
                  <Typography
                    color="#ABABAB"
                    textAlign="center"
                    fontSize="0.875rem"
                    margin="0.25rem 0"
                  >
                    OR
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ backgroundColor: '#FF885B', '&:hover': { backgroundColor: '#ff7a47' } }}
                    onClick={handleSignUpWithGoogle}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <img src="/icons/google-logo.svg" width={24} height={24} alt="google-logo" />
                      <Typography fontWeight={600} color="#fffff6">
                        Sign up with Google
                      </Typography>
                    </Box>
                  </Button>
                </Stack>
              </Stack>
            </form>
          </div>
        </Paper>
      </Box>
      <Footer />
    </Box>
  );
};

export default SignUpPage;
