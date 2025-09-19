import axiosClient from '@/lib/axiosClient';
import type { UIRecipe, BackendRecipe } from '@/types/ui-recipe';

// Convert backend recipe to frontend UI recipe format
function convertBackendRecipeToUI(backendRecipe: BackendRecipe): UIRecipe {
  return {
    id: parseInt(backendRecipe.id.slice(-8), 16), // Convert UUID to number for UI compatibility
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
    category: mapBackendCategoryToUI(backendRecipe.category),
    ingredients: backendRecipe.ingredients.map(ing => ({
      name: ing.name,
      quantity: ing.quantity
    })),
    steps: backendRecipe.steps.map(step => ({
      step_number: step.stepNumber,
      instruction: step.instruction,
      image_url: step.imageUrl || undefined
    }))
  };
}

// Map backend category to UI category
function mapBackendCategoryToUI(backendCategory: string): UIRecipe['category'] {
  switch (backendCategory.toUpperCase()) {
    case 'DESSERT':
      return 'Dessert';
    case 'DRINK':
      return 'Drink';
    case 'MAIN_DISH':
      return 'Main Dish';
    default:
      return 'Main Dish';
  }
}

// Convert frontend number ID back to backend UUID string
function convertUIIdToBackendId(uiRecipeId: number): string {
  const mapping = JSON.parse(localStorage.getItem('recipe_id_mapping') || '{}');
  return mapping[uiRecipeId] || uiRecipeId.toString();
}

// Store ID mapping for future use
export function storeRecipeIdMapping(uiId: number, backendId: string) {
  const mapping = JSON.parse(localStorage.getItem('recipe_id_mapping') || '{}');
  mapping[uiId] = backendId;
  localStorage.setItem('recipe_id_mapping', JSON.stringify(mapping));
}

export interface FavoriteListResult {
  data: UIRecipe[];
  total: number;
}

export const favoriteService = {
  // Add recipe to favorites
  async addFavorite(recipeId: number): Promise<void> {
    const backendRecipeId = convertUIIdToBackendId(recipeId);
    console.log('Adding to favorites:', { uiId: recipeId, backendId: backendRecipeId });
    
    await axiosClient.post('/favorites', {
      recipeId: backendRecipeId
    });
  },

  // Remove recipe from favorites
  async removeFavorite(recipeId: number): Promise<void> {
    const backendRecipeId = convertUIIdToBackendId(recipeId);
    console.log('Removing from favorites:', { uiId: recipeId, backendId: backendRecipeId });
    
    await axiosClient.delete('/favorites', {
      params: { recipeId: backendRecipeId }
    });
  },

  // Get user's favorite recipe IDs
  async getFavoriteIds(): Promise<number[]> {
    try {
      const response = await axiosClient.get('/favorites');
      const favoriteData = response.data.data || [];
      
      // Convert backend recipe IDs to frontend number IDs
      return favoriteData.map((fav: any) => {
        const backendId = fav.recipeId;
        const uiId = parseInt(backendId.slice(-8), 16);
        
        // Store mapping for future use
        storeRecipeIdMapping(uiId, backendId);
        
        return uiId;
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
        // Store ID mapping
        storeRecipeIdMapping(uiRecipe.id, backendRecipe.id);
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
  async toggleFavorite(recipeId: number, currentlyFavorited: boolean): Promise<void> {
    if (currentlyFavorited) {
      await this.removeFavorite(recipeId);
    } else {
      await this.addFavorite(recipeId);
    }
  }
};
