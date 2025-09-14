export type UIRecipeCategory = "Dessert" | "Drink" | "Main Dish";

export interface UIRecipe {
  id: number;
  title: string;
  description: string;
  author_name: string;
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
