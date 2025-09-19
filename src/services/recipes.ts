import type { UIRecipe, UIRecipeCategory, BackendRecipe } from "@/types/ui-recipe";
import axiosClient from '@/lib/axiosClient';

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
function mapBackendCategoryToUI(backendCategory: string): UIRecipeCategory {
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
  authorId?: string
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

    console.log("Request params:", params);

    const response = await axiosClient.get('/recipes', { params });
    const result = response.data;

    console.log("API result:", result);

    return {
      data: (result.items ?? []).map(convertBackendRecipeToUI),
      total: result.total ?? 0,
    };
  } catch (error) {
    console.error("Failed to fetch recipes:", error);
    throw new Error("Failed to fetch recipes");
  }
}

// Get user's own recipes
export async function getUserRecipes(
  userId: string,
  page = 1,
  pageSize = 20
): Promise<ListResult> {
  return listRecipes(page, pageSize, {}, undefined, userId);
}

export async function getRecipeById(id: string): Promise<UIRecipe> {
  try {
    const response = await axiosClient.get(`/recipes/${id}`);
    return convertBackendRecipeToUI(response.data);
  } catch (error) {
    console.error("Failed to fetch recipe:", error);
    throw new Error("Failed to fetch recipe");
  }
}