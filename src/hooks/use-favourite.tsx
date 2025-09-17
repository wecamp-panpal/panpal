import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('favorite-recipes');
    if (saved) {
      try {
        const favoriteIds = JSON.parse(saved);
        setFavorites(new Set(favoriteIds));
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavorites(new Set());
      }
    }
  }, []);

  const handleToggleFavorite = (recipeId: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(recipeId)) {
        next.delete(recipeId);
      } else {
        next.add(recipeId);
      }
      localStorage.setItem('favorite-recipes', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  return { favorites, handleToggleFavorite };
};