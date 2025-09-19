import { useReducer, useEffect, useCallback, useRef } from 'react';
import { favoriteService } from '@/services/favorites';
import { clearCurrentUserCache } from '@/services/auth';

// State shape
interface FavoriteState {
  favorites: Set<number>;
  isLoading: boolean;
  lastSyncTime: number;
  hasInitialized: boolean;
  lastAction?: { type: 'add' | 'remove'; recipeId: number };
}

// Actions
type FavoriteAction =
  | { type: 'INITIALIZE'; payload: number[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_FAVORITE'; payload: number }
  | { type: 'REMOVE_FAVORITE'; payload: number }
  | { type: 'SYNC_FROM_BACKEND'; payload: number[] }
  | { type: 'SYNC_FROM_STORAGE'; payload: number[] };

// Reducer
const favoriteReducer = (state: FavoriteState, action: FavoriteAction): FavoriteState => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        favorites: new Set(action.payload),
        hasInitialized: true,
        lastSyncTime: Date.now(),
        lastAction: undefined
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'ADD_FAVORITE':
      if (state.favorites.has(action.payload)) return state;
      const newFavoritesAdd = new Set(state.favorites);
      newFavoritesAdd.add(action.payload);
      return {
        ...state,
        favorites: newFavoritesAdd,
        lastSyncTime: Date.now(),
        lastAction: { type: 'add', recipeId: action.payload }
      };

    case 'REMOVE_FAVORITE':
      if (!state.favorites.has(action.payload)) return state;
      const newFavoritesRemove = new Set(state.favorites);
      newFavoritesRemove.delete(action.payload);
      return {
        ...state,
        favorites: newFavoritesRemove,
        lastSyncTime: Date.now(),
        lastAction: { type: 'remove', recipeId: action.payload }
      };

    case 'SYNC_FROM_BACKEND':
      // Only sync if data actually changed
      const currentArray = Array.from(state.favorites).sort();
      const newArray = action.payload.sort();
      
      if (JSON.stringify(currentArray) === JSON.stringify(newArray)) {
        return state; // No change, prevent unnecessary re-render
      }
      
      return {
        ...state,
        favorites: new Set(action.payload),
        lastSyncTime: Date.now(),
        lastAction: undefined // Clear action since this is bulk sync
      };

    case 'SYNC_FROM_STORAGE':
      return {
        ...state,
        favorites: new Set(action.payload),
        lastAction: undefined // Clear action since this is bulk sync
      };

    default:
      return state;
  }
};

// Initial state factory
const createInitialState = (): FavoriteState => {
  try {
    const saved = localStorage.getItem('favorite-recipes');
    if (saved) {
      const favoriteIds = JSON.parse(saved);
      if (Array.isArray(favoriteIds)) {
        return {
          favorites: new Set(favoriteIds),
          isLoading: false,
          lastSyncTime: 0,
          hasInitialized: true,
          lastAction: undefined
        };
      }
    }
  } catch (error) {
    console.error('Error initializing favorites from localStorage:', error);
  }
  
  return {
    favorites: new Set(),
    isLoading: false,
    lastSyncTime: 0,
    hasInitialized: false,
    lastAction: undefined
  };
};

// Main hook
export const useFavorites = () => {
  const [state, dispatch] = useReducer(favoriteReducer, null, createInitialState);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isBackendSyncingRef = useRef(false);

  // Sync to localStorage whenever favorites change
  useEffect(() => {
    if (state.hasInitialized) {
      const favoritesArray = Array.from(state.favorites);
      localStorage.setItem('favorite-recipes', JSON.stringify(favoritesArray));
      
      // Broadcast changes to other components with specific action info
      if (state.lastAction) {
        window.dispatchEvent(new CustomEvent('favoriteChanged', {
          detail: { 
            recipeId: state.lastAction.recipeId,
            isFavorited: state.lastAction.type === 'add',
            favorites: favoritesArray,
            count: favoritesArray.length,
            timestamp: Date.now()
          }
        }));
      }
    }
  }, [state.favorites, state.hasInitialized, state.lastAction]);

  // Load favorites from backend (with debouncing)
  const syncWithBackend = useCallback(async (force = false) => {
    if (isBackendSyncingRef.current && !force) return;
    
    try {
      isBackendSyncingRef.current = true;
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const favoriteIds = await favoriteService.getFavoriteIds();
      
      if (Array.isArray(favoriteIds)) {
        dispatch({ type: 'SYNC_FROM_BACKEND', payload: favoriteIds });
      }
    } catch (error) {
      console.error('Error syncing favorites with backend:', error);
      // Keep existing state on error - no fallbacks needed
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      isBackendSyncingRef.current = false;
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    if (!state.hasInitialized) {
      syncWithBackend(true);
    }
  }, [state.hasInitialized, syncWithBackend]);

  // Toggle favorite (optimistic with backend sync)
  const toggleFavorite = useCallback(async (recipeId: number) => {
    const wasCurrentlyFavorited = state.favorites.has(recipeId);
    
    // Optimistic update
    if (wasCurrentlyFavorited) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: recipeId });
    } else {
      dispatch({ type: 'ADD_FAVORITE', payload: recipeId });
    }
    
    try {
      // Backend sync
      await favoriteService.toggleFavorite(recipeId, wasCurrentlyFavorited);
      
      // Clear auth cache to refresh user context
      clearCurrentUserCache();
      
      console.log(`${wasCurrentlyFavorited ? 'Removed from' : 'Added to'} favorites:`, recipeId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      
      // Revert optimistic update on error
      if (wasCurrentlyFavorited) {
        dispatch({ type: 'ADD_FAVORITE', payload: recipeId });
      } else {
        dispatch({ type: 'REMOVE_FAVORITE', payload: recipeId });
      }
      
      alert('Failed to update favorite status. Please try again.');
    }
  }, [state.favorites]);

  // Force refresh from backend
  const refreshFavorites = useCallback(() => {
    return syncWithBackend(true);
  }, [syncWithBackend]);

  // Sync from localStorage (for recipe loading scenarios)
  const syncFromLocalStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem('favorite-recipes');
      if (saved) {
        const favoriteIds = JSON.parse(saved);
        if (Array.isArray(favoriteIds)) {
          dispatch({ type: 'SYNC_FROM_STORAGE', payload: favoriteIds });
        }
      }
    } catch (error) {
      console.error('Error syncing from localStorage:', error);
    }
  }, []);

  // Listen for external changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'favorite-recipes' && e.newValue) {
        try {
          const favoriteIds = JSON.parse(e.newValue);
          if (Array.isArray(favoriteIds)) {
            dispatch({ type: 'SYNC_FROM_STORAGE', payload: favoriteIds });
          }
        } catch (error) {
          console.error('Error handling storage change:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    favorites: state.favorites,
    favoriteCount: state.favorites.size,
    isLoading: state.isLoading,
    isInitialized: state.hasInitialized,
    toggleFavorite,
    refreshFavorites,
    syncFromLocalStorage,
    // Legacy compatibility
    handleToggleFavorite: toggleFavorite
  };
};

export default useFavorites;
