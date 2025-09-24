import RecipeCard from '../recipes/recipe-card';
import { Typography, Box } from '@mui/material';
import type { UIRecipe } from '@/types/ui-recipe';
import { useFavorites } from '@/hooks/use-favourite';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trendingRecipe } from '@/services/recipes';
import { favoriteService } from '@/services/favorites';

const PAGE_SIZE = 24;

const Trending = () => {
  const [recipes, setRecipes] = useState<UIRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  const [allFavoriteRecipes, setAllFavoriteRecipes] = useState<UIRecipe[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  const { favorites, handleToggleFavorite } = useFavorites();
  const navigate = useNavigate();

  

  useEffect(() => {
    const fetchTrendingRecipes = async () => {
      try {
        setLoading(true);
        const trendingRecipes = await trendingRecipe(8);
        setRecipes(trendingRecipes);
      } catch (error) {
        console.error('Failed to fetch trending recipes:', error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingRecipes();
  }, []);

  useEffect(() => {
    const fetchAllFavorites = async () => {
      try {
        setFavoritesLoading(true);
        if (favorites.length === 0) {
          setAllFavoriteRecipes([]);
          return;
        }
        const result = await favoriteService.getFavoriteRecipes(1, PAGE_SIZE);
        setAllFavoriteRecipes(result.data);
      } catch (error) {
        console.error('Failed to fetch favorite recipes:', error);
        setAllFavoriteRecipes([]);
      } finally {
        setFavoritesLoading(false);
      }
    };

    fetchAllFavorites();
  }, [favorites]);

  return (
    <section className="w-full pt-16 pb-32 px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-start relative gap-8">
          <Typography
            variant="h2"
            sx={{
              marginBottom: '24px',
              fontSize: '52px',
              fontWeight: 500,
            }}
          >
            Trending
          </Typography>
        </div>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 2,
            mt: 4,
          }}
        >
          {loading ? (
            Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <Box
                key={i}
                sx={{
                  height: 280,
                  borderRadius: 2,
                  bgcolor: 'rgba(0,0,0,.05)',
                }}
              />
            ))
          ) : recipes.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center', gridColumn: '1 / -1' }}>
              <Typography>No recipes found.</Typography>
            </Box>
          ) : (
            recipes.map(r => (
              <RecipeCard
                key={r.id}
                recipe={r}
                variant="public"
                onClick={() => navigate(`/recipes/${r.id}`)}
                isFavorited={favorites.includes(r.id)}
                onToggleFavorite={() => handleToggleFavorite(r.id)}
              />
            ))
          )}
        </Box>
        <Typography
          variant="h2"
          sx={{
            marginTop: 3,
            fontSize: '52px',
            fontWeight: 500,
          }}
        >
          Favourite
        </Typography>

        {favoritesLoading ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography>Loading favourites…</Typography>
          </Box>
        ) : allFavoriteRecipes.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                fontFamily: 'Montserrat',
                fontSize: '18px',
                fontWeight: 400,
              }}
            >
              You have no favourite yet, start scrolling!
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 2,
              mt: 4,
            }}
          >
            {allFavoriteRecipes
              .filter(r => favorites.includes(r.id))
              .map(r => (
                <RecipeCard
                  key={r.id}
                  recipe={r}
                  variant="public"
                  onClick={() => navigate(`/recipes/${r.id}`)}
                  isFavorited={favorites.includes(r.id)}
                  onToggleFavorite={() => handleToggleFavorite(r.id)}
                />
              ))}
          </Box>
        )}
      </div>
    </section>
  );
};

export default Trending;
