import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/stores/store';
import {
  fetchFavorites,
  toggleFavorite,
  selectFavoriteIds,
  selectFavoriteCount,
  selectFavoritesLoading,
  selectFavoritesInitialized,
} from '@/stores/favoritesSlice';

export const useFavorites = () => {
  const dispatch = useDispatch<AppDispatch>();

  const ids = useSelector(selectFavoriteIds);
  const favoriteCount = useSelector(selectFavoriteCount);
  const isLoading = useSelector(selectFavoritesLoading);
  const isInitialized = useSelector(selectFavoritesInitialized);

  const favorites = useMemo(() => {
    return ids;
  }, [ids]);

  useEffect(() => {
    if (!isInitialized) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, isInitialized]);

  const handleToggleFavorite = (recipeId: string) => {
    dispatch(toggleFavorite(recipeId));
  };

  const refreshFavorites = () => dispatch(fetchFavorites());

  return {
    favorites,
    favoriteCount,
    isLoading,
    isInitialized,
    handleToggleFavorite,
    refreshFavorites,
  };
};

export default useFavorites;
