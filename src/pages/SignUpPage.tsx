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
      <Box display="flex" flexDirection="row">
        <Box flex={1} display="flex" justifyContent="left" alignItems="center" padding={'2rem'} color={'#FDF2E5'}>
          <Paper elevation={3} sx={{ p: 4, minWidth: 400 , borderRadius:'12px', backgroundColor: '#FDF2E5',}}>
            <div ref={formRef}>
              <form onSubmit={handleSubmit}>
                <Stack sx={{ marginBottom: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight={400} fontSize="0.9375rem" color="#000">
                      Welcome to Panpal
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
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)}>
                                  {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
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
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)}>
                                  {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
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
                      sx={{ backgroundColor: 'primary', borderRadius: 2 }}
                    >
                      <Box display="flex" alignItems="center" gap={0.5} padding={'0.5rem 1rem'}>
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
                      sx={{ backgroundColor: '#836751', borderRadius:2}}
                      onClick={handleSignUpWithGoogle}
                    >
                      <Box display="flex" alignItems="center" gap={2} padding={'0.5rem 1rem'}>
                        <img src="google-logo.svg" width={24} height={24} alt="google-logo" />
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
        <Box 
          flex={1} 
          display="flex" 
          justifyContent="left" 
          alignItems="left" 
          style={{ 
            overflow: 'hidden',
          }}
        >
          <img
            src="public/signup_img.svg"
            alt="Panpal Logo"
            style={{
              width: 'calc(100% + 4rem)', // tăng width để bù phần bị cắt
              height: 'auto',
              marginLeft: '-8rem', // cắt 8rem bên trái
              display: 'block',
            }}
          />
        </Box>

      </Box>
      
    </Box>
  );
};

export default SignUpPage;
