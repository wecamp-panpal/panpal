import type { UIRecipe, UIRecipeCategory } from "@/types/ui-recipe";

export interface UIRecipeWithMeta extends UIRecipe {
  created_at: string;
}

const CATS: UIRecipeCategory[] = ["Dessert", "Drink", "Main Dish"];
const DIFFS = ["Easy", "Medium", "Hard"] as const;

export function makeMockRecipes(count = 60): UIRecipeWithMeta[] {
  const now = Date.now();
  const out: UIRecipeWithMeta[] = [];

  for (let i = 0; i < count; i++) {
    const cat = CATS[i % CATS.length];
    const rating = 3 + ((i * 7) % 20) / 10;
    const ratingCount = 5 + (i % 20);
    const minutes = 10 + (i % 6) * 10;
    const created = new Date(now - i * 24 * 60 * 60 * 1000).toISOString();

    out.push({
      id: i + 1,
      title: `${cat} Recipe #${i + 1}`,
      description: `Tasty ${cat} recipe number ${i + 1}`,
      author_name: `Chef ${String.fromCharCode(65 + (i % 26))}`,
      cooking_time: `${minutes} mins`,
      category: cat,
      difficulty: DIFFS[i % DIFFS.length],
      rating: Number(rating.toFixed(1)),
      rating_avg: Number(rating.toFixed(1)),
      rating_count: ratingCount,
      image: `https://picsum.photos/seed/panpal-${i + 1}/800/600`,
      created_at: created,
      ingredients: [
        { name: "Flour", quantity: "2 cups" },
        { name: "Eggs", quantity: "3" },
        { name: "Milk", quantity: "1 cup" },
      ],
      steps: [
        { step_number: 1, instruction: "Mix all dry ingredients.", image_url: `https://picsum.photos/seed/step-${i + 1}-1/600/400` },
        { step_number: 2, instruction: "Add wet ingredients and stir well." },
        { step_number: 3, instruction: "Bake at 180°C for 25 minutes.", image_url: `https://picsum.photos/seed/step-${i + 1}-3/600/400` },
      ],
    });
  }

  return out;
}