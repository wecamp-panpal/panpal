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
    difficulty: 'Medium',
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

  async getFavoriteIds(): Promise<string[]> {
    try {
      const response = await axiosClient.get('/favorites');
      const items = response.data?.items || [];
      return items.map((fav: any) => String(fav.recipe?.id)).filter(Boolean);
    } catch (error) {
      console.error('Failed to load favorite IDs:', error);
      return [];
    }
  },

  async getFavoriteRecipes(page = 1, limit = 20): Promise<FavoriteListResult> {
    try {
      const response = await axiosClient.get('/favorites/recipes', {
        params: { page, limit },
      });

      const result = response.data;
      const recipes = (result.items || []).map((backendRecipe: BackendRecipe) =>
        convertBackendRecipeToUI(backendRecipe)
      );

      return {
        data: recipes,
        total: result.total || 0,
      };
    } catch (error) {
      console.error('Failed to load favorite recipes:', error);
      return { data: [], total: 0 };
    }
  },

  async toggleFavorite(recipeId: string, currentlyFavorited: boolean): Promise<void> {
    if (currentlyFavorited) {
      await this.removeFavorite(recipeId);
    } else {
      await this.addFavorite(recipeId);
    }
  },
};
