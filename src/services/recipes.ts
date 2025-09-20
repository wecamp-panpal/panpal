import type { UIRecipe, UIRecipeCategory, BackendRecipe } from '@/types/ui-recipe';
import axiosClient from '@/lib/axiosClient';

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
    category: backendRecipe.category as UIRecipeCategory,
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
      params.category = filters.categories[0]; // API expects single category
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

    console.log('Request params:', params);

    const response = await axiosClient.get('/recipes', { params });
    const result = response.data;

    console.log('API result:', result);

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
    console.error('Failed to delete recipe:', error);
    throw new Error('Failed to delete recipe');
  }
}

export async function trendingRecipe(number: string): Promise<UIRecipe[]> {
  try {
    const response = await axiosClient.get(`/recipes/trending`, { params: { number } });
    return (response.data.items ?? []).map(convertBackendRecipeToUI);
  } catch (error) {
    console.error('Failed to fetch trending recipes:', error);
    throw new Error('Failed to fetch trending recipes');
  }
}
