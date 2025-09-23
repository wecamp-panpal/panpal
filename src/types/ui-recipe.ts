export type UIRecipeCategory = "APPETIZER" | "DESSERT" | "MAIN_DISH" | "SIDE_DISH" | "SOUP" | "SAUCE" | "DRINK" | "SALAD";

export interface UIRecipe {
  id: string;
  title: string;
  description: string;
  author_name: string;
  author_id: string;
  cooking_time: string;
  image: string;
  difficulty: string;
  rating: number;
  rating_avg: number;
  rating_count: number;
  category: UIRecipeCategory;
  ingredients: { name: string; quantity: string }[];
  steps: { step_number: number; instruction: string; image_url?: string;}[];
}

// Backend recipe response type
export interface BackendRecipe {
  id: string;
  title: string;
  description?: string | null;
  cookingTime?: string | null;
  authorName: string;
  authorId: string;
  category: string;
  imageUrl?: string | null;
  ratingAvg?: number | null;
  ratingCount?: number | null;
  isFavorite?: boolean;
  myRating?: number | null;
  createdAt: string;
  updatedAt: string;
  ingredients: { id: string; name: string; quantity: string }[];
  steps: { id: string; stepNumber: number; instruction: string; imageUrl?: string | null }[];
}