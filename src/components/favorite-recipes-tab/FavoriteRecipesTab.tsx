import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { Favorite as FavoriteIcon } from '@mui/icons-material';
import RecipeCard from '../recipe-card/RecipeCard';
import type { UIRecipe } from '@/types/ui-recipe';

interface FavoriteRecipesTabProps {
  favoriteRecipes: UIRecipe[];
  onViewRecipe?: (recipeId: number) => void;
  onToggleFavorite?: (recipeId: number) => void;
  favorites?: Set<number>;
}

const FavoriteRecipesTab: React.FC<FavoriteRecipesTabProps> = ({
  favoriteRecipes,
  onViewRecipe,
  onToggleFavorite,
  favorites = new Set(),
}) => {
  return (
    <Box sx={{ px: 4, pb: 4 }}>
      {/* Favorite Recipes Content */}
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 3, 
          color: 'primary.main',
          fontWeight: 'bold'
        }}
      >
        My Favorite Recipes
      </Typography>
      
      {favoriteRecipes.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <FavoriteIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'grey.600', mb: 1 }}>
            No favorite recipes yet
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.500' }}>
            Start exploring recipes and add them to your favorites!
          </Typography>
        </Box>
      ) : (
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 2.5
        }}>
          {favoriteRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              variant="public"
              onClick={() => onViewRecipe?.(recipe.id)}
              onToggleFavorite={onToggleFavorite}
              isFavorited={favorites.has(recipe.id)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FavoriteRecipesTab;
