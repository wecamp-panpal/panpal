export type Recipe = {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  cuisine?: string;
  category?: "Dessert" | "Drink" | "Main dish" | "Party" | "Vegan";
  cookTimeMin?: number;
  rating?: number;
  votes: number;
};

export async function fetchRecipes(): Promise<Recipe[]> {
  return [
    {
      id: "1",
      title: "Vietnamese Bo Kho with rice",
      author: "@jocelynnguyen",
      imageUrl:
        "https://images.unsplash.com/photo-1604908176997-431d2c1b5ebe?q=80&w=1200&auto=format&fit=crop",
      cuisine: "Vietnamese",
      category: "Main dish",
      cookTimeMin: 75,
      rating: 4.8,
      votes: 127,
    },
    {
      id: "2",
      title: "Texas style smoked brisket",
      author: "@sheldoncoop",
      imageUrl:
        "https://images.unsplash.com/photo-1601050690597-9ee8ee3f8f9b?q=80&w=1200&auto=format&fit=crop",
      category: "Party",
      cookTimeMin: 240,
      rating: 4.9,
      votes: 214,
    },
    {
      id: "3",
      title: "Italian truffle mushroom soup",
      author: "@masonjonas",
      imageUrl:
        "https://images.unsplash.com/photo-1528712306091-ed0763094c98?q=80&w=1200&auto=format&fit=crop",
      category: "Main dish",
      cookTimeMin: 30,
      rating: 4.7,
      votes: 98,
    },
    {
      id: "4",
      title: "Vegan avocado chocolate mousse",
      author: "@plantpower",
      imageUrl:
        "https://images.unsplash.com/photo-1606756790138-261b3e2c8b66?q=80&w=1200&auto=format&fit=crop",
      category: "Dessert",
      cookTimeMin: 10,
      rating: 4.6,
      votes: 86,
    },
    {
      id: "5",
      title: "Pho bo (beef noodle soup)",
      author: "@ngocphan",
      imageUrl:
        "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
      cuisine: "Vietnamese",
      category: "Main dish",
      cookTimeMin: 45,
      rating: 4.9,
      votes: 305,
    },
    {
      id: "6",
      title: "Tiramisu in a glass",
      author: "@dolciitalia",
      imageUrl:
        "https://images.unsplash.com/photo-1609183187347-8912d2b318d0?q=80&w=1200&auto=format&fit=crop",
      category: "Dessert",
      cookTimeMin: 20,
      rating: 4.7,
      votes: 141,
    },
    {
      id: "7",
      title: "Matcha iced latte",
      author: "@sakura",
      imageUrl:
        "https://images.unsplash.com/photo-1551024709-8f23befc6cf7?q=80&w=1200&auto=format&fit=crop",
      category: "Drink",
      cookTimeMin: 5,
      rating: 4.4,
      votes: 62,
    },
    {
      id: "8",
      title: "15-minute garlic noodles",
      author: "@streetchef",
      imageUrl:
        "https://images.unsplash.com/photo-1617191519566-5797b1e0d0e1?q=80&w=1200&auto=format&fit=crop",
      category: "Main dish",
      cookTimeMin: 15,
      rating: 4.3,
      votes: 90,
    },
  ];
}
