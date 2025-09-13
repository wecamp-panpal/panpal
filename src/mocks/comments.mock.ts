export interface MockComment {
  id: string;
  recipe_id: string;
  user_id: string;
  user_name: string;
  content: string;
  rating: number;
  image_url?: string;
  created_at: string;
}

export function makeMockComments(recipe_id: string): MockComment[] {
  return [
    {
      id: "cmt-1",
      recipe_id,
      user_id: "user-1",
      user_name: "Alice",
      content: "Món này quá ngon luôn á 😍",
      rating: 4.8,
      image_url: "https://picsum.photos/seed/comment1/400/250",
      created_at: "2025-09-10T10:30:00Z",
    },
    {
      id: "cmt-2",
      recipe_id,
      user_id: "user-2",
      user_name: "Bob",
      content: "Làm nhanh, ăn lạ miệng, nhưng hơi nhạt xíu.",
      rating: 3.6,
      created_at: "2025-09-09T15:20:00Z",
    },
    {
      id: "cmt-3",
      recipe_id,
      user_id: "user-3",
      user_name: "Clara",
      content: "Không ngờ mình làm được món này dễ vậy!",
      rating: 5.0,
      created_at: "2025-09-08T09:12:00Z",
    },
  ];
}
