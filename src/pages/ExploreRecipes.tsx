import { useMemo, useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import type { UIRecipe, UIRecipeCategory } from '@/types/ui-recipe';
import type { RecipeFilters } from '@/services/recipes';
import { listRecipes } from '@/services/recipes';
import FilterBar from '@/components/recipes/FilterBar';
import type { FilterState } from '@/components/recipes/FilterBar';
import RecipeCard from '@/components/recipe-card/RecipeCard';
import { useFavorites } from '@/hooks/useFavorites';

const PAGE_SIZE = 24;

export default function ExploreRecipes() {
  const [selected, setSelected] = useState<FilterState>(new Set());
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [recipes, setRecipes] = useState<UIRecipe[]>([]);
  const [loading, setLoading] = useState(false);

  const { favorites, handleToggleFavorite, syncFromLocalStorage } = useFavorites();

  // Listen for favorite changes to keep UI in sync across components
  useEffect(() => {
    const handleFavoriteChange = () => {
      // Sync favorites state when changes occur from other pages
      syncFromLocalStorage();
    };

    window.addEventListener('favoriteChanged', handleFavoriteChange);
    
    return () => {
      window.removeEventListener('favoriteChanged', handleFavoriteChange);
    };
  }, [syncFromLocalStorage]);

  const location = useLocation();
  const navigate = useNavigate();

  const searchQuery = new URLSearchParams(location.search).get('q') || '';

  const filters: RecipeFilters = useMemo(() => {
    const cats = ['Dessert', 'Drink', 'Main dish', 'Party', 'Vegan'].filter(c =>
      selected.has(c as UIRecipeCategory)
    ) as UIRecipeCategory[];
    return { categories: cats };
  }, [selected]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    listRecipes(page, PAGE_SIZE, filters, searchQuery || undefined)
      .then(({ data, total }) => {
        console.log("API result:", { data, total });
        if (!ignore) {
          setRecipes(data);
          setTotal(total);
          // Sync favorites after recipes are loaded
          syncFromLocalStorage();
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [page, filters, searchQuery]);

  const onToggle = (chip: UIRecipeCategory) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(chip)) next.delete(chip);
      else next.add(chip);
      return next;
    });
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, py: 3 }}>
      <Typography variant="h3" sx={{ mb: 2, fontFamily: '"Playfair Display", serif' }}>
        Explore Recipes
      </Typography>

      <FilterBar
        selected={selected}
        onToggle={onToggle}
        onClear={() => {
          setSelected(new Set());
          setPage(1);
        }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" sx={{ m: 0, fontFamily: '"Playfair Display", serif' }}>
          All Recipes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {loading ? 'Loading…' : `${total} result${total === 1 ? '' : 's'}`}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 2,
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
              onToggleFavorite={handleToggleFavorite}
              isFavorited={favorites.has(r.id)}
            />
          ))
        )}
      </Box>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 4 }}>
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === page;

            const shouldShow =
              pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - page) <= 1;

            if (!shouldShow && pageNum !== 2 && pageNum !== totalPages - 1) {
              if (
                (pageNum === page - 2 && page > 4) ||
                (pageNum === page + 2 && page < totalPages - 3)
              ) {
                return (
                  <Typography key={pageNum} sx={{ px: 1 }}>
                    ...
                  </Typography>
                );
              }
              return null;
            }

            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                style={{
                  padding: '6px 12px',
                  border: isActive ? '2px solid #391F06' : '1px solid #ccc',
                  backgroundColor: isActive ? '#391F06' : '#fff',
                  color: isActive ? '#fff' : '#391F06',
                  borderRadius: '6px',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  minWidth: 36,
                }}
              >
                {pageNum}
              </button>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
