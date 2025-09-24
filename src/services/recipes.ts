import type { UIRecipe, UIRecipeCategory, BackendRecipe } from '@/types/ui-recipe';
import axiosClient from '@/lib/axiosClient';


function toNum(n: unknown, d = 0): number {
  const x = Number(n);
  return Number.isFinite(x) ? x : d;
}
function clamp01to5(n: number): number {
  return Math.max(0, Math.min(5, n));
}


function convertBackendRecipeToUI(backendRecipe: BackendRecipe): UIRecipe {
  const avg = toNum(
    (backendRecipe as any).ratingAvg ?? (backendRecipe as any).avg_rating ?? backendRecipe.myRating,
    0,
  );
  const cnt = toNum(
    (backendRecipe as any).ratingCount ?? (backendRecipe as any).ratingsCount,
    0,
  );

  return {
    id: backendRecipe.id,
    title: backendRecipe.title,
    description: backendRecipe.description || '',
    author_name: (backendRecipe as any).authorName || '',
    author_id: (backendRecipe as any).authorId || '',
    cooking_time: String((backendRecipe as any).cookingTime || ''),
    image: (backendRecipe as any).imageUrl || '/api/placeholder/400/300',
    difficulty: 'Medium', 

    rating: clamp01to5(avg),
    rating_avg: clamp01to5(avg),
    rating_count: cnt,

    category: (backendRecipe.category as UIRecipeCategory) ?? ('Main Dish' as UIRecipeCategory),

    ingredients: (backendRecipe as any).ingredients
      ? (backendRecipe as any).ingredients.map((ing: any) => ({
          name: ing.name,
          quantity: ing.quantity,
        }))
      : [],
    steps: (backendRecipe as any).steps
      ? (backendRecipe as any).steps.map((step: any) => ({
          step_number: step.stepNumber,
          instruction: step.instruction,
          image_url: step.imageUrl || undefined,
        }))
      : [],
  };
}

export interface RecipeFilters {
  categories?: UIRecipeCategory[];
}

export interface ListResult {
  data: UIRecipe[];
  total: number;
}

export async function listRecipes(
  page: number,
  pageSize: number,
  filters: RecipeFilters,
  searchText?: string,
  authorId?: string,
  bustCache = false
): Promise<ListResult> {
  try {
    const params: Record<string, string> = {
      page: page.toString(),
      limit: pageSize.toString(),
    };

    if (filters.categories && filters.categories.length) {
      params.category = filters.categories[0];
    }
    if (searchText?.trim()) {
      params.search = searchText.trim();
    }
    if (authorId) {
      params.authorId = authorId;
    }
    if (bustCache) {
      params._t = Date.now().toString();
    }

    const response = await axiosClient.get('/recipes', { params });
    const result = response.data;

    return {
      data: (result.items ?? []).map(convertBackendRecipeToUI),
      total: result.total ?? 0,
    };
  } catch (error) {
    console.error('Failed to fetch recipes:', error);
    throw new Error('Failed to fetch recipes');
  }
}

// Get user's own recipes
export async function getUserRecipes(
  userId: string,
  page = 1,
  pageSize = 20,
  bustCache = false
): Promise<ListResult> {
  return listRecipes(page, pageSize, {}, undefined, userId, bustCache);
}

export async function getRecipeById(recipeId: string, bustCache = false): Promise<UIRecipe> {
  try {
    const url = bustCache ? `/recipes/${recipeId}?_t=${Date.now()}` : `/recipes/${recipeId}`;
    const response = await axiosClient.get(url);
    return convertBackendRecipeToUI(response.data);
  } catch (error) {
    console.error('Failed to fetch recipe:', error);
    throw new Error('Failed to fetch recipe');
  }
}

export async function getRandomRecipe(category?: UIRecipeCategory): Promise<UIRecipe> {
  try {
    const params: Record<string, string> = {};
    if (category) params.category = category;
    const response = await axiosClient.get('/recipes/random', { params });
    return convertBackendRecipeToUI(response.data);
  } catch (error) {
    console.error('Failed to fetch random recipe:', error);
    throw new Error('Failed to fetch random recipe');
  }
}

export async function updateRecipe(
  recipeId: string,
  updates: {
    title?: string;
    description?: string;
    cookingTime?: string;
    category?: UIRecipeCategory;
    ingredients?: { name: string; quantity: string }[];
    steps?: { stepNumber?: number; instruction: string; imageUrl?: string }[];
  }
): Promise<UIRecipe> {
  try {
    const payload: any = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.cookingTime !== undefined) payload.cookingTime = updates.cookingTime;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.ingredients !== undefined) payload.ingredients = updates.ingredients;
    if (updates.steps !== undefined) payload.steps = updates.steps;

    const response = await axiosClient.patch(`/recipes/${recipeId}`, payload);
    return convertBackendRecipeToUI(response.data);
  } catch (error) {
    console.error('Failed to update recipe:', error);
    throw new Error('Failed to update recipe');
  }
}

export async function updateRecipeImage(recipeId: string, imageFile: File): Promise<UIRecipe> {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axiosClient.post(`/recipes/${recipeId}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return convertBackendRecipeToUI(response.data);
  } catch (error) {
    console.error('Failed to update recipe image:', error);
    throw new Error('Failed to update recipe image');
  }
}

export async function deleteRecipe(recipeId: string): Promise<void> {
  try {
    await axiosClient.delete(`/recipes/${recipeId}`);
  } catch (error) {
    console.error('Failed to delete recipe', error);
    throw new Error('Failed to delete recipe');
  }
}

export async function trendingRecipe(limit: number): Promise<UIRecipe[]> {
  const { data } = await axiosClient.get('/recipes/trending', {
    params: { limit: String(limit) },
  });

  const items = data?.items ?? [];

  return items.map((it: any) => {
    const avg = toNum(it.ratingAvg ?? it.avg_rating ?? it.myRating, 0);
    const cnt = toNum(it.ratingCount ?? it.ratingsCount, 0);

    return {
      id: it.id,
      title: it.title,
      description: it.description ?? '',
      author_name: it.authorName ?? 'Anonymous',
      author_id: it.authorId ?? '',
      cooking_time: String(it.cookingTime ?? ''),
      image: it.imageUrl || '/api/placeholder/400/300',
      difficulty: 'Medium',
      rating: clamp01to5(avg),
      rating_avg: clamp01to5(avg),
      rating_count: cnt,
      category: (it.category as UIRecipeCategory) ?? ('Main Dish' as UIRecipeCategory),
      ingredients: [],
      steps: [],
    } as UIRecipe;
  });
}
