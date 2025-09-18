import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
} from '@mui/material';
import { muiTheme } from '@/lib/muiTheme';
import UserDashboardHeader from '@/components/user-dashboard-header/UserDashboardHeader';
import TabPanel from '@/components/tab-panel/TabPanel';
import ProfileInfo from '@/components/profile-info/ProfileInfo';
import MyRecipesTab from '@/components/my-recipes-tab/MyRecipesTab';
import FavoriteRecipesTab from '@/components/favorite-recipes-tab/FavoriteRecipesTab';
import type { UIRecipe } from '@/types/ui-recipe';
import { makeMockRecipes } from '@/mocks/recipes.mock';
import { useFavorites } from '@/hooks/useFavourite';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/user';

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  country: string;
  avatar: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, refreshUser, isLoading: authLoading } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '',
    fullName: '',
    email: '',
    country: 'Vietnam', // Default country
    avatar: '/api/placeholder/150/150'
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(userProfile);

  console.log('🔵 Profile component render - user:', user, 'authLoading:', authLoading);

  // Initialize profile data from user context
  useEffect(() => {
    console.log('🔵 Profile useEffect triggered - user:', user);
    if (user) {
      const profile: UserProfile = {
        id: user.id,
        fullName: user.name || '',
        email: user.email,
        country: user.country || 'Vietnam', // Use country from backend or default
        avatar: user.avatarUrl || '/api/placeholder/150/150'
      };
      setUserProfile(profile);
      setEditedProfile(profile);
      console.log('🔵 Profile initialized with user data:', profile);
    }
  }, [user]);

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <div>Loading profile...</div>
      </Container>
    );
  }

  // Show error if no user
  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <div>No user data available. Please try logging in again.</div>
      </Container>
    );
  }

  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia',
    'Austria', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Belarus', 'Belgium',
    'Bolivia', 'Brazil', 'Bulgaria', 'Cambodia', 'Canada', 'Chile', 'China',
    'Colombia', 'Croatia', 'Czech Republic', 'Denmark', 'Ecuador', 'Egypt',
    'Estonia', 'Finland', 'France', 'Georgia', 'Germany', 'Ghana', 'Greece',
    'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
    'Israel', 'Italy', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait',
    'Latvia', 'Lebanon', 'Lithuania', 'Luxembourg', 'Malaysia', 'Mexico',
    'Morocco', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Pakistan',
    'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia',
    'Saudi Arabia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa',
    'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 'Thailand',
    'Turkey', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
    'Uruguay', 'Venezuela', 'Vietnam'
  ];

  const [myRecipes] = useState<UIRecipe[]>(makeMockRecipes(8));
  const [recipes] = useState<UIRecipe[]>(makeMockRecipes());
  const { favorites, handleToggleFavorite } = useFavorites();
   const favoriteRecipes = useMemo(() => {
    return recipes.filter(recipe => favorites.has(recipe.id));
  }, [recipes, favorites]);


  

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(userProfile);
  };

  const handleSave = async () => {
    // Check for email validation before saving
    if (emailError) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const updateData = {
        name: editedProfile.fullName.trim(),
        email: editedProfile.email.trim(),
        country: editedProfile.country.trim(),
      };
      
      console.log('🔵 Updating profile with data:', updateData);
      
      const updatedUser = await userService.updateProfile(userProfile.id, updateData);
      
      // Update local profile with backend response
      const updatedProfile: UserProfile = {
        id: updatedUser.id,
        fullName: updatedUser.name || '',
        email: updatedUser.email,
        country: updatedUser.country || 'Vietnam', // Use backend country
        avatar: updatedUser.avatarUrl || '/api/placeholder/150/150'
      };
      
      setUserProfile(updatedProfile);
      setIsEditing(false);
      setEmailError('');
      
      // Refresh auth context with updated user data
      await refreshUser();
      
      console.log('🔵 Profile updated successfully:', updatedProfile);
      
    } catch (error) {
      console.error('🔴 Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(userProfile);
    setEmailError('');
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Email validation
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError('');
      }
    }
  };

  const handleCountryChange = (value: string | null) => {
    setEditedProfile(prev => ({
      ...prev,
      country: value || ''
    }));
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditedProfile(prev => ({
          ...prev,
          avatar: result
        }));
      };
      reader.readAsDataURL(file);

      // Upload to backend
      setIsLoading(true);
      try {
        console.log('🔵 Uploading avatar file:', file.name);
        const updatedUser = await userService.uploadAvatar(file);
        
        // Update profile with new avatar URL from backend
        const updatedProfile: UserProfile = {
          ...userProfile,
          avatar: updatedUser.avatarUrl || userProfile.avatar
        };
        
        setUserProfile(updatedProfile);
        setEditedProfile(updatedProfile);
        
        // Refresh auth context
        await refreshUser();
        
        console.log('🔵 Avatar uploaded successfully');
        
      } catch (error) {
        console.error('🔴 Failed to upload avatar:', error);
        alert('Failed to upload avatar. Please try again.');
        // Revert preview on error
        setEditedProfile(prev => ({
          ...prev,
          avatar: userProfile.avatar
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Recipe action handlers
  const handleAddNewRecipe = () => {
    console.log('Add new recipe');
    // Navigate to add recipe page or open modal
  };

  const handleEditRecipe = (recipeId: number) => {
    console.log('Edit recipe:', recipeId);
    // Navigate to edit recipe page
  };

  const handleViewRecipe = (recipeId: number) => {
    navigate(`/recipes/${recipeId}`);
  };


  return (
    <Container maxWidth="lg" sx={{ py: 2, my: 6 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          backgroundColor: 'background.default',
          border: `2px solid ${muiTheme.palette.secondary.main}`,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <UserDashboardHeader
          tabValue={tabValue}
          isEditing={isEditing}
          myRecipesCount={myRecipes.length}
          favoriteRecipesCount={favoriteRecipes.length}
          onTabChange={handleTabChange}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            <ProfileInfo
              userProfile={userProfile}
              editedProfile={editedProfile}
              isEditing={isEditing}
              isLoading={isLoading}
              emailError={emailError}
              countries={countries}
              onInputChange={handleInputChange}
              onCountryChange={handleCountryChange}
              onAvatarChange={handleAvatarChange}
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <MyRecipesTab
            myRecipes={myRecipes}
            onAddNewRecipe={handleAddNewRecipe}
            onEditRecipe={handleEditRecipe}
            onViewRecipe={handleViewRecipe}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <FavoriteRecipesTab
            favoriteRecipes={favoriteRecipes}
            onViewRecipe={handleViewRecipe}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
          />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Profile;