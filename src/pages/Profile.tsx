import React, { useState } from 'react';
import {
  Container,
  Paper,
} from '@mui/material';
import { muiTheme } from '@/lib/muiTheme';
import UserDashboardHeader from '@/components/user-dashboard-header/UserDashboardHeader';
import TabPanel from '@/components/tab-panel/TabPanel';
import ProfileInfo from '@/components/profile-info/ProfileInfo';
import MyRecipesTab from '@/components/my-recipes-tab/MyRecipesTab';
import FavoriteRecipesTab from '@/components/favorite-recipes-tab/FavoriteRecipesTab';

interface UserProfile {
  fullName: string;
  email: string;
  country: string;
  avatar: string;
}

interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  cookTime: string;
  difficulty: string;
  rating: number;
  category: string;
}

const Profile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: 'John Smith',
    email: 'john.smith@example.com',
    country: 'United States',
    avatar: '/api/placeholder/150/150'
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(userProfile);

  // List of countries for dropdown
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

  // Mock user's own recipes data
  const [myRecipes] = useState<Recipe[]>([
    {
      id: 1,
      title: 'My Special Pancakes',
      description: 'Fluffy pancakes with a secret ingredient that makes them extra delicious',
      image: '/src/assets/ramen.jpg',
      cookTime: '25 mins',
      difficulty: 'Easy',
      rating: 4.7,
      category: 'Breakfast'
    },
    {
      id: 2,
      title: 'Homemade Ramen Bowl',
      description: 'Rich and flavorful ramen with homemade broth and fresh toppings',
      image: '/src/assets/ramen.jpg',
      cookTime: '2 hours',
      difficulty: 'Hard',
      rating: 4.9,
      category: 'Asian'
    },
    {
      id: 3,
      title: 'Garden Fresh Salad',
      description: 'Crispy vegetables from my garden with homemade vinaigrette',
      image: '/src/assets/ramen.jpg',
      cookTime: '10 mins',
      difficulty: 'Easy',
      rating: 4.3,
      category: 'Healthy'
    }
  ]);

  const [favoriteRecipes] = useState<Recipe[]>([
    {
      id: 1,
      title: 'Spaghetti Carbonara',
      description: 'Classic Italian pasta dish with eggs, cheese, and pancetta',
      image: '/src/assets/ramen.jpg',
      cookTime: '20 mins',
      difficulty: 'Medium',
      rating: 4.5,
      category: 'Italian'
    },
    {
      id: 2,
      title: 'Chicken Teriyaki',
      description: 'Tender chicken glazed with sweet teriyaki sauce',
      image: '/src/assets/ramen.jpg',
      cookTime: '30 mins',
      difficulty: 'Easy',
      rating: 4.8,
      category: 'Japanese'
    },
    {
      id: 3,
      title: 'Vegetable Stir Fry',
      description: 'Fresh vegetables stir-fried with aromatic spices',
      image: '/src/assets/ramen.jpg',
      cookTime: '15 mins',
      difficulty: 'Easy',
      rating: 4.2,
      category: 'Asian'
    },
    {
      id: 4,
      title: 'Homemade Bread',
      description: 'Freshly baked artisan bread with crispy crust',
      image: '/src/assets/ramen.jpg',
      cookTime: '3 hours',
      difficulty: 'Hard',
      rating: 4.6,
      category: 'Bakery'
    }
  ]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(userProfile);
  };

  const handleSave = () => {
    // Check for email validation before saving
    if (emailError) {
      return;
    }
    
    setUserProfile(editedProfile);
    setIsEditing(false);
    setEmailError('');
    console.log('Profile saved:', editedProfile);
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

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditedProfile(prev => ({
          ...prev,
          avatar: result
        }));
      };
      reader.readAsDataURL(file);
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
    console.log('View recipe:', recipeId);
    // Navigate to recipe detail page
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
          <ProfileInfo
            userProfile={userProfile}
            editedProfile={editedProfile}
            isEditing={isEditing}
            emailError={emailError}
            countries={countries}
            onInputChange={handleInputChange}
            onCountryChange={handleCountryChange}
            onAvatarChange={handleAvatarChange}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <MyRecipesTab
            myRecipes={myRecipes}
            onAddNewRecipe={handleAddNewRecipe}
            onEditRecipe={handleEditRecipe}
            onViewRecipe={handleViewRecipe}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <FavoriteRecipesTab
            favoriteRecipes={favoriteRecipes}
            onViewRecipe={handleViewRecipe}
          />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Profile;