import { useMemo, useState, useEffect } from 'react';
import { Box, Typography, Button, Tooltip, CircularProgress } from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import { useLocation, useNavigate } from 'react-router-dom';
import type { UIRecipe, UIRecipeCategory } from '@/types/ui-recipe';
import type { RecipeFilters } from '@/services/recipes';
import { listRecipes, getRandomRecipe } from '@/services/recipes';
import FilterBar from '@/components/recipes/FilterBar';
import type { FilterState } from '@/components/recipes/FilterBar';
import RecipeCard from '@/components/recipe-card/RecipeCard';
import { useFavorites } from '@/hooks/useFavorites';
import { toast } from 'react-hot-toast';
const PAGE_SIZE = 24;

export default function ExploreRecipes() {
  const [selected, setSelected] = useState<FilterState>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [recipes, setRecipes] = useState<UIRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [randomLoading, setRandomLoading] = useState(false);

  const { favorites, handleToggleFavorite } = useFavorites();

  const location = useLocation();
  const navigate = useNavigate();

  const searchQuery = new URLSearchParams(location.search).get('q') || '';

  const filters: RecipeFilters = useMemo(() => {
    return selected ? { categories: [selected] } : {};
  }, [selected]);

  const handleRandom = async () => {
    try {
      setRandomLoading(true);
      const category = selected ?? undefined;
      const recipe = await getRandomRecipe(category as UIRecipeCategory | undefined);
      navigate(`/recipes/${recipe.id}`);
    } catch (err) {
      console.error('Failed to fetch random recipe', err);
      toast.error('No recipes found. Please adjust filters and try again.');
    } finally {
      setRandomLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    listRecipes(page, PAGE_SIZE, filters, searchQuery || undefined)
      .then(({ data, total }) => {
        if (!ignore) {
          setRecipes(data);
          setTotal(total);
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
    setSelected(prev => (prev === chip ? null : chip));
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, py: 3 }}>
      <Typography variant="h3" sx={{ mb: 2, fontFamily: '"Playfair Display", serif' }}>
        Explore Recipes
      </Typography>

      <FilterBar selected={selected} onToggle={onToggle} />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" sx={{ m: 0, fontFamily: '"Playfair Display", serif' }}>
          All Recipes
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            {loading ? 'Loading…' : `${total} result${total === 1 ? '' : 's'}`}
          </Typography>
          <Tooltip title={selected ? `Feeling Lucky in ${selected}` : 'Tired of browsing? Try this Random Recipe button'}>
            <Button
              size="small"
              variant="contained"
              disableElevation
              onClick={handleRandom}
              disabled={randomLoading}
              startIcon={!randomLoading ? <CasinoIcon sx={{ fontSize: 18 }} /> : undefined}
              sx={{
                textTransform: 'none',
                borderRadius: 999,
                px: 1.8,
                py: 0.7,
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: 0.2,
                background: 'linear-gradient(45deg, #D4A574, #B8864D)',
                color: '#fff',
                boxShadow: '0 8px 18px rgba(184, 134, 77, 0.35)',
                transition: 'transform 0.15s ease, box-shadow 0.2s ease, filter 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-1px) scale(1.02)',
                  boxShadow: '0 10px 22px rgba(184, 134, 77, 0.45)',
                  filter: 'brightness(1.03)',
                },
                '&:disabled': {
                  opacity: 0.8,
                },
              }}
            >
              {randomLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={14} sx={{ color: '#fff' }} />
                  Randomizing...
                </Box>
              ) : selected ? (
                `(${selected})`
              ) : (
                'Feeling Lucky'
              )}
            </Button>
          </Tooltip>
        </Box>
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
              isFavorited={favorites.includes(r.id)}
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
