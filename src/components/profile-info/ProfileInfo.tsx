import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  TextField,
  IconButton,
  Autocomplete,
} from '@mui/material';
import { Image as ImageIcon } from '@mui/icons-material';
import { muiTheme } from '@/lib/muiTheme';

interface UserProfile {
  fullName: string;
  email: string;
  country: string;
  avatar: string;
}

interface ProfileInfoProps {
  userProfile: UserProfile;
  editedProfile: UserProfile;
  isEditing: boolean;
  emailError: string;
  countries: string[];
  onInputChange: (field: keyof UserProfile, value: string) => void;
  onCountryChange: (value: string | null) => void;
  onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  userProfile,
  editedProfile,
  isEditing,
  emailError,
  countries,
  onInputChange,
  onCountryChange,
  onAvatarChange,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
      {/* Avatar Section */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        minWidth: { md: '300px' }
      }}>
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Avatar
            src={isEditing ? editedProfile.avatar : userProfile.avatar}
            sx={{
              width: 150,
              height: 150,
              border: `3px solid ${muiTheme.palette.secondary.main}`,
              fontSize: '3rem',
              backgroundColor: 'secondary.main',
              color: 'primary.main'
            }}
          >
            {userProfile.fullName.charAt(0)}
          </Avatar>
          
          {isEditing && (
            <IconButton
              component="label"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'primary.main',
                color: 'secondary.main',
                '&:hover': {
                  backgroundColor: 'secondary.main',
                  color: 'primary.main'
                },
                '&:focus': {
                  outline: 'none',
                  boxShadow: 'none'
                }
              }}
            >
              <ImageIcon />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={onAvatarChange}
              />
            </IconButton>
          )}
        </Box>
        
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'primary.main',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          {userProfile.fullName}
        </Typography>
      </Box>

      {/* Profile Information */}
      <Box sx={{ flex: 1 }}>
        <Card 
          elevation={0}
          sx={{ 
            backgroundColor: 'transparent',
            border: `1px solid ${muiTheme.palette.secondary.main}`,
            borderRadius: 2
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                color: 'primary.main',
                fontWeight: 'bold'
              }}
            >
              Personal Information
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Full Name */}
              <Box>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    mb: 1, 
                    color: 'primary.main',
                    fontWeight: 'medium'
                  }}
                >
                  Full Name
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    value={editedProfile.fullName}
                    onChange={(e) => onInputChange('fullName', e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'secondary.main',
                        },
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                ) : (
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      p: 2,
                      backgroundColor: 'secondary.main',
                      borderRadius: 1,
                      color: 'primary.main'
                    }}
                  >
                    {userProfile.fullName}
                  </Typography>
                )}
              </Box>

              {/* Email */}
              <Box>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    mb: 1, 
                    color: 'primary.main',
                    fontWeight: 'medium'
                  }}
                >
                  Email
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => onInputChange('email', e.target.value)}
                    variant="outlined"
                    error={!!emailError}
                    helperText={emailError}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: emailError ? 'error.main' : 'secondary.main',
                        },
                        '&:hover fieldset': {
                          borderColor: emailError ? 'error.main' : 'primary.main',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: emailError ? 'error.main' : 'primary.main',
                        },
                      },
                    }}
                  />
                ) : (
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      p: 2,
                      backgroundColor: 'secondary.main',
                      borderRadius: 1,
                      color: 'primary.main'
                    }}
                  >
                    {userProfile.email}
                  </Typography>
                )}
              </Box>

              {/* Country */}
              <Box>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    mb: 1, 
                    color: 'primary.main',
                    fontWeight: 'medium'
                  }}
                >
                  Country
                </Typography>
                {isEditing ? (
                  <Autocomplete
                    value={editedProfile.country}
                    onChange={(_, newValue) => onCountryChange(newValue)}
                    options={countries}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        variant="outlined"
                        placeholder="Search for a country..."
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'background.default',
                            '& fieldset': {
                              borderColor: 'secondary.main',
                            },
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                          '& .MuiInputBase-input': {
                            color: 'primary.main',
                          },
                        }}
                      />
                    )}
                    sx={{
                      '& .MuiAutocomplete-popupIndicator': {
                        color: 'primary.main',
                      },
                      '& .MuiAutocomplete-clearIndicator': {
                        color: 'primary.main',
                      },
                    }}
                    componentsProps={{
                      paper: {
                        sx: {
                          backgroundColor: 'background.default',
                          border: `1px solid ${muiTheme.palette.secondary.main}`,
                          borderRadius: 1,
                          boxShadow: '0px 4px 12px rgba(57, 31, 6, 0.1)',
                          '& .MuiAutocomplete-listbox': {
                            // Hide scrollbar while keeping scroll functionality
                            '&::-webkit-scrollbar': {
                              display: 'none',
                            },
                            '-ms-overflow-style': 'none',
                            'scrollbar-width': 'none',
                            '& .MuiAutocomplete-option': {
                              color: 'primary.main',
                              fontFamily: 'Montserrat',
                              '&:hover': {
                                backgroundColor: 'secondary.main',
                                color: 'primary.main',
                              },
                              '&.Mui-focused': {
                                backgroundColor: 'secondary.main',
                                color: 'primary.main',
                              },
                              '&[aria-selected="true"]': {
                                backgroundColor: 'primary.main',
                                color: 'secondary.main',
                                '&:hover': {
                                  backgroundColor: 'primary.main',
                                  color: 'secondary.main',
                                },
                              },
                            },
                          },
                          '& .MuiAutocomplete-noOptions': {
                            color: 'primary.main',
                            fontFamily: 'Montserrat',
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      p: 2,
                      backgroundColor: 'secondary.main',
                      borderRadius: 1,
                      color: 'primary.main'
                    }}
                  >
                    {userProfile.country}
                  </Typography>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ProfileInfo;
