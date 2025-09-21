import React from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import { MenuBook as MenuBookIcon } from '@mui/icons-material';
import RecipeCard from '../recipe-card/RecipeCard';
import type { UIRecipe } from '@/types/ui-recipe';

interface MyRecipesTabProps {
  myRecipes: UIRecipe[];
  onAddNewRecipe?: () => void;
  onEditRecipe?: (recipeId: string) => void;
  onViewRecipe?: (recipeId: string) => void;
  onToggleFavorite?: (recipeId: string) => void;
  favorites?: string[];
}

const MyRecipesTab: React.FC<MyRecipesTabProps> = ({
  myRecipes,
  onAddNewRecipe,
  onViewRecipe,
  onToggleFavorite,
  favorites = [],
}) => {
  return (
    <Box sx={{ px: 4, pb: 4 }}>
      {/* My Recipes Content */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'primary.main',
            fontWeight: 'bold'
          }}
        >
          My Recipes
        </Typography>
        <Button
          variant="contained"
          onClick={onAddNewRecipe}
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
          + Add New Recipe
        </Button>
      </Box>
      
      {myRecipes.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <MenuBookIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'grey.600', mb: 1 }}>
            No recipes created yet
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.500' }}>
            Start creating your own delicious recipes!
          </Typography>
        </Box>
      ) : (
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 2.5
        }}>
          {myRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              variant="public"
              onClick={() => onViewRecipe?.(recipe.id)}
              onToggleFavorite={onToggleFavorite}
              isFavorited={favorites.includes(recipe.id)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default MyRecipesTab;
