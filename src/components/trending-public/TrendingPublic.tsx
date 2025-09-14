import RecipeCard from '../recipe-card/RecipeCard';
import { Typography, Box } from '@mui/material';
import type { UIRecipe } from '@/types/ui-recipe';

const PAGE_SIZE = 24;

import { useState } from 'react';
import { makeMockRecipes } from '@/mocks/recipes.mock';
import { useNavigate } from 'react-router-dom';

const TrendingPublic = () => {
  const [recipes] = useState<UIRecipe[]>(makeMockRecipes(8));
  const [loading] = useState(false);

  const navigate = useNavigate();

  return (
    <section className="w-full pt-4 pb-32 px-8 relative">
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
            Trending Recipes
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
                // Không có favorite functionality cho public user
                isFavorited={false}
                onToggleFavorite={() => {}} // Empty function - no action
              />
            ))
          )}
        </Box>
      </div>
    </section>
  );
};

export default TrendingPublic;
