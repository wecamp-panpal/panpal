import React from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  MenuBook as MenuBookIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';

interface UserDashboardHeaderProps {
  tabValue: number;
  isEditing: boolean;
  myRecipesCount: number;
  favoriteRecipesCount: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const UserDashboardHeader: React.FC<UserDashboardHeaderProps> = ({
  tabValue,
  isEditing,
  myRecipesCount,
  favoriteRecipesCount,
  onTabChange,
  onEdit,
  onSave,
  onCancel,
}) => {
  return (
    <Box sx={{ p: 4, pb: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            color: 'primary.main',
            fontWeight: 'bold'
          }}
        >
          User Dashboard
        </Typography>
        
        {tabValue === 0 && (
          !isEditing ? (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={onEdit}
              sx={{
                backgroundColor: 'primary.main',
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
              Edit Profile
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={onSave}
                sx={{
                  backgroundColor: 'primary.main',
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
                Save
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={onCancel}
                sx={{
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'secondary.main',
                    backgroundColor: 'secondary.main',
                    color: 'primary.main'
                  },
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none'
                  }
                }}
              >
                Cancel
              </Button>
            </Box>
          )
        )}
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={onTabChange}
          sx={{
            '& .MuiTab-root': {
              color: 'primary.main',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(234, 201, 163, 0.30)',
                color: 'primary.main',
              },
              '&.Mui-selected': {
                color: 'primary.main',
                fontWeight: 'bold'
              },
              '&:focus': {
                outline: 'none',
                boxShadow: 'none'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main'
            }
          }}
        >
          <Tab 
            icon={<PersonIcon />} 
            label="Profile" 
            iconPosition="start"
            sx={{ textTransform: 'none', fontSize: '1rem' }}
          />
          <Tab 
            icon={<MenuBookIcon />} 
            label={`My Recipes (${myRecipesCount})`} 
            iconPosition="start"
            sx={{ textTransform: 'none', fontSize: '1rem' }}
          />
          <Tab 
            icon={<FavoriteIcon />} 
            label={`Favorite Recipes (${favoriteRecipesCount})`} 
            iconPosition="start"
            sx={{ textTransform: 'none', fontSize: '1rem' }}
          />
        </Tabs>
      </Box>
    </Box>
  );
};

export default UserDashboardHeader;
