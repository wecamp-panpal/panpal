import type { UIRecipe, UIRecipeCategory } from "@/types/ui-recipe";

export interface RecipeFilters {
  categories?: UIRecipeCategory[];
}

export interface ListResult {
  data: UIRecipe[];
  total: number;
}

const API_URL = "http://localhost:3000/api";

export async function listRecipes(
  page: number,
  pageSize: number,
  filters: RecipeFilters,
  searchText?: string
): Promise<ListResult> {
  const params = new URLSearchParams();

  params.set("page", page.toString());
  params.set("limit", pageSize.toString());

  if (filters.categories && filters.categories.length) {
    filters.categories.forEach((cat) => {
      params.append("category", cat);
    });
  }

  if (searchText?.trim()) {
    params.set("search", searchText.trim());
  }

  const url = `${API_URL}/recipes?${params.toString()}`;

  console.log("Request URL:", url);

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch recipes");

  const result = await res.json();

  console.log("API result:", result);

  return {
    data: result.items ?? [],
    total: result.total ?? result.data?.length ?? 0,
  };
}

export async function getRecipeById(id: string): Promise<UIRecipe> {
  const res = await fetch(`http://localhost:3000/api/recipes/${id}`);
  if (!res.ok) throw new Error("Failed to fetch recipe");
  return await res.json();
}