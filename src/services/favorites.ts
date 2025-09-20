import axiosClient from '@/lib/axiosClient';
import type { UIRecipe, BackendRecipe } from '@/types/ui-recipe';

// Convert backend recipe to frontend UI recipe format
function convertBackendRecipeToUI(backendRecipe: BackendRecipe): UIRecipe {
  return {
    id: backendRecipe.id,
    title: backendRecipe.title,
    description: backendRecipe.description || '',
    author_name: backendRecipe.authorName,
    author_id: backendRecipe.authorId,
    cooking_time: backendRecipe.cookingTime || '',
    image: backendRecipe.imageUrl || '/api/placeholder/400/300',
    difficulty: 'Medium', // Default difficulty since backend doesn't have this
    rating: backendRecipe.myRating || 0,
    rating_avg: backendRecipe.ratingAvg || 0,
    rating_count: backendRecipe.ratingCount || 0,
    category: backendRecipe.category.toUpperCase() as UIRecipe['category'],
    ingredients: backendRecipe.ingredients.map(ing => ({
      name: ing.name,
      quantity: ing.quantity,
    })),
    steps: backendRecipe.steps.map(step => ({
      step_number: step.stepNumber,
      instruction: step.instruction,
      image_url: step.imageUrl || undefined,
    })),
  };
}

export interface FavoriteListResult {
  data: UIRecipe[];
  total: number;
}

export const favoriteService = {
  async addFavorite(recipeId: string): Promise<void> {
    await axiosClient.post('/favorites', { recipeId });
  },

  async removeFavorite(recipeId: string): Promise<void> {
    await axiosClient.delete('/favorites', {
      params: { recipeId },
    });
  },

  // Get user's favorite recipe IDs
  async getFavoriteIds(): Promise<number[]> {
    try {
      const response = await axiosClient.get('/favorites');
      const favoriteData = response.data.data || [];
      
      // Convert backend recipe IDs to frontend number IDs
      return favoriteData.map((fav: any) => {       
        return fav.recipeId;
      });
    } catch (error) {
      console.error('Failed to load favorite IDs:', error);
      return [];
    }
  },

  // Get user's favorite recipes with full data
  async getFavoriteRecipes(page = 1, limit = 20): Promise<FavoriteListResult> {
    try {
      const response = await axiosClient.get('/favorites/recipes', {
        params: { page, limit }
      });

      const result = response.data;
      const recipes = (result.items || []).map((backendRecipe: BackendRecipe) => {
        const uiRecipe = convertBackendRecipeToUI(backendRecipe);
        return uiRecipe;
      });

      return {
        data: recipes,
        total: result.total || 0
      };
    } catch (error) {
      console.error('Failed to load favorite recipes:', error);
      return { data: [], total: 0 };
    }
  },

  // Toggle favorite status (add or remove)
  async toggleFavorite(recipeId: string, currentlyFavorited: boolean): Promise<void> {
    if (currentlyFavorited) {
      await this.removeFavorite(recipeId);
    } else {
      await this.addFavorite(recipeId);
    }
  },
};
