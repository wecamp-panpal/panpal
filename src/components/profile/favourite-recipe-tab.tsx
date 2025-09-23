import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Favorite as FavoriteIcon } from '@mui/icons-material';
import RecipeCard from '../recipes/recipe-card';
import type { UIRecipe } from '@/types/ui-recipe';
import { favoriteService } from '@/services/favorites';

interface FavoriteRecipesTabProps {
  favorites: string[];
  onViewRecipe?: (recipeId: string) => void;
  onToggleFavorite?: (recipeId: string) => void;
}

const FavoriteRecipesTab: React.FC<FavoriteRecipesTabProps> = ({
  favorites,
  onViewRecipe,
  onToggleFavorite,
}) => {
  const [recipes, setRecipes] = useState<UIRecipe[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFavorites = async () => {
      if (favorites.length === 0) {
        setRecipes([]);
        return;
      }
      setLoading(true);
      try {
        const result = await favoriteService.getFavoriteRecipes(1, 50);
        const filtered = result.data.filter(r => favorites.includes(r.id));
        setRecipes(filtered);
      } catch (err) {
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [favorites]);

  return (
    <Box sx={{ px: 4, pb: 4 }}>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          color: 'primary.main',
          fontWeight: 'bold',
        }}
      >
        My Favorite Recipes
      </Typography>

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : recipes.length === 0 ? (
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
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 2.5,
          }}
        >
          {recipes.map(recipe => (
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

export default FavoriteRecipesTab;
