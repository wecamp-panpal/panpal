import axiosClient from '@/lib/axiosClient';
import type { UIRecipe, BackendRecipe } from '@/types/ui-recipe';

function toNum(n: unknown, d = 0): number {
  const x = Number(n);
  return Number.isFinite(x) ? x : d;
}
function clampRating(n: number): number {
  return Math.max(0, Math.min(5, n));
}

function convertBackendRecipeToUI(backendRecipe: Partial<BackendRecipe> & Record<string, any>): UIRecipe {
  const avg = toNum(
    backendRecipe.ratingAvg ?? backendRecipe.avg_rating ?? backendRecipe.myRating,
    0
  );
  const cnt = toNum(
    backendRecipe.ratingCount ?? backendRecipe.ratingsCount,
    0
  );

  return {
    id: String(backendRecipe.id),
    title: backendRecipe.title ?? '',
    description: backendRecipe.description ?? '',
    author_name: backendRecipe.authorName ?? '',
    author_id: backendRecipe.authorId ?? '',
    cooking_time: String(backendRecipe.cookingTime ?? ''),
    image: backendRecipe.imageUrl || '/api/placeholder/400/300',
    difficulty: 'Medium',

    rating: clampRating(avg),
    rating_avg: clampRating(avg),
    rating_count: cnt,

    category: (backendRecipe.category as UIRecipe['category']) ?? ('Main Dish' as UIRecipe['category']),

    ingredients: Array.isArray(backendRecipe.ingredients)
      ? backendRecipe.ingredients.map((ing: any) => ({
          name: ing?.name ?? '',
          quantity: ing?.quantity ?? '',
        }))
      : [],
    steps: Array.isArray(backendRecipe.steps)
      ? backendRecipe.steps.map((step: any) => ({
          step_number: step?.stepNumber ?? step?.step_number,
          instruction: step?.instruction ?? '',
          image_url: step?.imageUrl ?? step?.image_url ?? undefined,
        }))
      : [],
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
    await axiosClient.delete('/favorites', { params: { recipeId } });
  },

  async getFavoriteIds(): Promise<string[]> {
    try {
      const response = await axiosClient.get('/favorites');
      const items = response.data?.items || [];
      return items
        .map((fav: any) => (fav?.recipe?.id ?? fav?.recipeId ?? fav?.id))
        .filter(Boolean)
        .map(String);
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

      const result = response.data ?? {};
      const rawItems = Array.isArray(result.items) ? result.items : [];

      const recipes: UIRecipe[] = rawItems.map((backendRecipe: any) =>
        convertBackendRecipeToUI(backendRecipe)
      );

      return {
        data: recipes,
        total: toNum(result.total, recipes.length),
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
