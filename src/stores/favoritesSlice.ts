import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { favoriteService } from '@/services/favorites';

export interface FavoritesState {
  ids: string[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: FavoritesState = {
  ids: [],
  isLoading: false,
  error: null,
  initialized: false,
};

// Lấy toàn bộ ID favorite từ backend
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async () => {
    const ids = await favoriteService.getFavoriteIds(); // trả về string[]
    return Array.from(new Set(ids.map(String)));
  }
);

// Toggle favorite (add/remove chính xác)
export const toggleFavorite = createAsyncThunk(
  'favorites/toggleFavorite',
  async (recipeId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { favorites: FavoritesState };
      const currentlyFavorited = state.favorites.ids.includes(recipeId);

      await favoriteService.toggleFavorite(recipeId, currentlyFavorited);

      return { recipeId, currentlyFavorited };
    } catch (err) {
      console.error('❌ toggleFavorite error', err);
      return rejectWithValue('Failed to toggle favorite');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.ids = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.ids = action.payload;
        state.isLoading = false;
        state.initialized = true;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.initialized = true;
        state.error = action.error.message || 'Failed to load favorites';
      })

      // Toggle favorite
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { recipeId, currentlyFavorited } = action.payload!;
        if (currentlyFavorited) {
          // Nếu trước đó đã có → remove
          state.ids = state.ids.filter(id => id !== recipeId);
        } else {
          // Nếu trước đó chưa có → add
          state.ids.push(recipeId);
        }
      })
      .addCase(toggleFavorite.rejected, (state) => {
        state.error = 'Failed to toggle favorite';
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;

// Selectors
export const selectFavoriteIds = (s: { favorites: FavoritesState }) => s.favorites.ids;
export const selectFavoriteCount = (s: { favorites: FavoritesState }) => s.favorites.ids.length;
export const selectFavoritesLoading = (s: { favorites: FavoritesState }) => s.favorites.isLoading;
export const selectFavoritesInitialized = (s: { favorites: FavoritesState }) => s.favorites.initialized;
