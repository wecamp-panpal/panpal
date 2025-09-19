import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Paper, Box, CircularProgress, Alert } from '@mui/material';
import { muiTheme } from '@/lib/muiTheme';
import UserDashboardHeader from '@/components/user-dashboard-header/UserDashboardHeader';
import TabPanel from '@/components/tab-panel/TabPanel';
import ProfileInfo from '@/components/profile-info/ProfileInfo';
import MyRecipesTab from '@/components/my-recipes-tab/MyRecipesTab';
import FavoriteRecipesTab from '@/components/favorite-recipes-tab/FavoriteRecipesTab';
import type { UIRecipe } from '@/types/ui-recipe';
import type { User } from '@/types/user';
import { useFavorites } from '@/hooks/useFavorites';
import { userService } from '@/services/user';
import { getCurrentUser, clearCurrentUserCache } from '@/services/auth';
import { getUserRecipes } from '@/services/recipes';
import { favoriteService } from '@/services/favorites';

interface UserProfile {
  fullName: string;
  email: string;
  country: string;
  avatar: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabValue, setTabValue] = useState(() => {
    // Get tab from URL query params (e.g., /profile?tab=1)
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      const tabNumber = parseInt(tabFromUrl, 10);
      // Validate tab number (0: Profile, 1: My Recipes, 2: Favorite Recipes)
      if (tabNumber >= 0 && tabNumber <= 2) {
        return tabNumber;
      }
    }
    return 0; // Default to Profile tab
  });
  const [isEditing, setIsEditing] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: '',
    email: '',
    country: '',
    avatar: '/api/placeholder/150/150',
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(userProfile);

  // Remove hardcoded user ID - will use getCurrentUser instead

  const countries = [
    'Not specified',
    'Afghanistan',
    'Albania',
    'Algeria',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahrain',
    'Bangladesh',
    'Belarus',
    'Belgium',
    'Bolivia',
    'Brazil',
    'Bulgaria',
    'Cambodia',
    'Canada',
    'Chile',
    'China',
    'Colombia',
    'Croatia',
    'Czech Republic',
    'Denmark',
    'Ecuador',
    'Egypt',
    'Estonia',
    'Finland',
    'France',
    'Georgia',
    'Germany',
    'Ghana',
    'Greece',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Israel',
    'Italy',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kuwait',
    'Latvia',
    'Lebanon',
    'Lithuania',
    'Luxembourg',
    'Malaysia',
    'Mexico',
    'Morocco',
    'Netherlands',
    'New Zealand',
    'Nigeria',
    'Norway',
    'Pakistan',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Qatar',
    'Romania',
    'Russia',
    'Saudi Arabia',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'South Africa',
    'South Korea',
    'Spain',
    'Sri Lanka',
    'Sweden',
    'Switzerland',
    'Thailand',
    'Turkey',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'United States',
    'Uruguay',
    'Venezuela',
    'Vietnam',
  ];

  const [myRecipes, setMyRecipes] = useState<UIRecipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<UIRecipe[]>([]);
  const [myRecipesLoading, setMyRecipesLoading] = useState(false);
  const [favoriteRecipesLoading, setFavoriteRecipesLoading] = useState(false);
  const { favorites, favoriteCount, handleToggleFavorite, refreshFavorites, syncFromLocalStorage } = useFavorites();

  const userToProfile = (user: User): UserProfile => ({
    fullName: user.name || '',
    email: user.email,
    country: user.country || 'Not specified',
    avatar: user.avatarUrl || '/api/placeholder/150/150',
  });

  const profileToUpdateData = (profile: UserProfile) => ({
    name: profile.fullName,
    email: profile.email,
    country: profile.country === 'Not specified' ? null : profile.country || null,
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await getCurrentUser();
        if (!userData) {
          // User not authenticated, redirect to sign in
          navigate('/sign-in');
          return;
        }
        setUser(userData);
        const profileData = userToProfile(userData);
        setUserProfile(profileData);
        setEditedProfile(profileData);
        
        console.log('User loaded:', {
          userData,
          avatarUrl: userData.avatarUrl,
          profileAvatar: profileData.avatar
        });
        
        // Load user's recipes and favorites
        const shouldForceRefresh = searchParams.get('tab') === '1'; // Force refresh if coming to My Recipes tab
        loadMyRecipes(userData.id, shouldForceRefresh);
        loadFavoriteRecipes();
      } catch (err) {
        console.error('Failed to load user:', err);
        setError('Failed to load user profile. Please try again.');
        // If error getting current user, redirect to login
        navigate('/sign-in');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [navigate, searchParams]);

  useEffect(() => {
    const handleFavoriteChange = (event: CustomEvent) => {
      const { recipeId, isFavorited } = event.detail;
      console.log('Favorite changed:', { recipeId, isFavorited });
      
      if (isFavorited) {
      } else {
        // Recipe was unfavorited - remove from favoriteRecipes
        setFavoriteRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      }
    };

    window.addEventListener('favoriteChanged', handleFavoriteChange as EventListener);
    
    return () => {
      window.removeEventListener('favoriteChanged', handleFavoriteChange as EventListener);
    };
  }, []);

  // No complex logic needed - favoriteCount is automatically stable!

  const loadMyRecipes = async (userId: string, forceRefresh = false) => {
    try {
      setMyRecipesLoading(true);
      console.log('Loading recipes for user:', userId, { forceRefresh });
      
      if (forceRefresh) {
        clearCurrentUserCache();
      }
      
      const result = await getUserRecipes(userId);
      setMyRecipes(result.data);
      
      syncFromLocalStorage();
      
      console.log('User recipes loaded:', result);
    } catch (err) {
      console.error('Failed to load user recipes:', err);
      setError('Failed to load your recipes. Please try again.');
    } finally {
      setMyRecipesLoading(false);
    }
  };

  // Load user's favorite recipes
  const loadFavoriteRecipes = async (forceRefresh = false) => {
    try {
      setFavoriteRecipesLoading(true);
      console.log('Loading favorite recipes', { forceRefresh });
      
      // Don't force refresh favorites on tab switch since favorites are already synced real-time
      // Only refresh if explicitly requested (e.g., initial load)
      if (forceRefresh && favoriteRecipes.length === 0) {
        console.log('Initial load - refreshing favorites cache');
        await refreshFavorites();
      }
      
      const result = await favoriteService.getFavoriteRecipes();
      setFavoriteRecipes(result.data);
      
      // Sync favorites state after favorite recipes are loaded
      syncFromLocalStorage();
      
      console.log('Favorite recipes loaded:', result);
    } catch (err) {
      console.error('Failed to load favorite recipes:', err);
      setError('Failed to load favorite recipes. Please try again.');
    } finally {
      setFavoriteRecipesLoading(false);
    }
  };

  // Refresh recipes when switching to different tabs
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    
    // Update URL to persist tab state on refresh
    setSearchParams(prevParams => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set('tab', newValue.toString());
      return newParams;
    });
    
    // If switching to My Recipes tab (index 1) and user exists, refresh recipes
    if (newValue === 1 && user?.id) {
      console.log('Switching to My Recipes tab, refreshing...');
      loadMyRecipes(user.id, true);
    }
    
    // If switching to Favorite Recipes tab (index 2), load favorites without forcing refresh
    if (newValue === 2) {
      console.log('Switching to Favorite Recipes tab, loading...');
      loadFavoriteRecipes(false); // Don't force refresh to prevent count flashing
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(userProfile);
  };

  const handleSave = async () => {
    if (emailError) {
      return;
    }

    try {
      setError(null);
      const updateData = profileToUpdateData(editedProfile);
      if (!user?.id) {
        throw new Error('User not found');
      }
      const updatedUser = await userService.updateUserById(user.id, updateData);
      setUser(updatedUser);
      
      // Clear auth cache so navbar gets updated user info
      clearCurrentUserCache();
      
      const updatedProfile = userToProfile(updatedUser);
      setUserProfile(updatedProfile);
      setEditedProfile(updatedProfile);
      setIsEditing(false);
      setEmailError('');
      
      console.log('Profile updated successfully:', updatedUser);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
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
      [field]: value,
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
      country: value || '',
    }));
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        setError(`File size too large. Maximum allowed size is ${Math.round(maxSize / (1024 * 1024))}MB. Your file is ${Math.round(file.size / (1024 * 1024))}MB.`);
        event.target.value = ''; // Reset input
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Please upload a JPG, PNG, or WebP image.');
        event.target.value = ''; // Reset input
        return;
      }

      try {
        setAvatarUploading(true);
        setError(null);
        
        if (!user?.id) {
          throw new Error('User not found');
        }
        const updatedUser = await userService.uploadAvatar(user.id, file);
        setUser(updatedUser);
        
        // Clear auth cache so navbar gets updated user info
        clearCurrentUserCache();
        
        const updatedProfile = userToProfile(updatedUser);
        setUserProfile(updatedProfile);
        setEditedProfile(updatedProfile);
        
        console.log('Avatar uploaded successfully!', {
          updatedUser,
          avatarUrl: updatedUser.avatarUrl,
          profileAvatar: updatedProfile.avatar
        });
      } catch (err) {
        console.error('Failed to upload avatar:', err);
        setError('Failed to upload avatar. Please try again.');
      } finally {
        setAvatarUploading(false);
        // Reset input value để có thể upload cùng file lại
        event.target.value = '';
      }
    }
  };

  // Recipe action handlers
  const handleAddNewRecipe = () => {
    navigate('/add-recipe');
  };

  const handleEditRecipe = (recipeId: number) => {
    console.log('Edit recipe:', recipeId);
    // Navigate to edit recipe page
  };

  const handleViewRecipe = (recipeId: number) => {
    navigate(`/recipes/${recipeId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 2, my: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2, my: 6 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper
        elevation={0}
        sx={{
          backgroundColor: 'background.default',
          border: `2px solid ${muiTheme.palette.secondary.main}`,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <UserDashboardHeader
          tabValue={tabValue}
          isEditing={isEditing}
          myRecipesCount={myRecipes.length}
          favoriteRecipesCount={favoriteCount}
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
              emailError={emailError}
              countries={countries}
              avatarUploading={avatarUploading}
              onInputChange={handleInputChange}
              onCountryChange={handleCountryChange}
              onAvatarChange={handleAvatarChange}
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {myRecipesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <MyRecipesTab
              myRecipes={myRecipes}
              onAddNewRecipe={handleAddNewRecipe}
              onEditRecipe={handleEditRecipe}
              onViewRecipe={handleViewRecipe}
              onToggleFavorite={handleToggleFavorite}
              favorites={favorites}
            />
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {favoriteRecipesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <FavoriteRecipesTab
              favoriteRecipes={favoriteRecipes}
              onViewRecipe={handleViewRecipe}
              onToggleFavorite={handleToggleFavorite}
              favorites={favorites}
            />
          )}
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Profile;
