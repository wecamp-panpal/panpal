import type { UIRecipe, UIRecipeCategory } from "@/types/ui-recipe";
import { makeMockRecipes, type UIRecipeWithMeta } from "@/mocks/recipes.mock";

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
  searchText?: string
): Promise<ListResult> {
  const all: UIRecipeWithMeta[] = makeMockRecipes(60);
  let filtered = all;

  if (filters.categories?.length) {
    const set = new Set(filters.categories);
    filtered = filtered.filter((r) => set.has(r.category));
  }

  if (searchText && searchText.trim() !== "") {
    const q = searchText.toLowerCase();
    filtered = filtered.filter((r) =>
      r.title.toLowerCase().includes(q)
    );
  }

  filtered.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const sliced = filtered.slice(start, end);

  const data = sliced.map(({ created_at, ingredients, steps, rating_avg, rating_count, ...rest }) => rest);

  return {
    data,
    total: filtered.length,
  };
}