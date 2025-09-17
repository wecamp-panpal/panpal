import axiosClient from "@/lib/axiosClient";

export async function createRecipeApi(payload: {
  title: string;
  description?: string;
  cookingTime?: string;
  authorName?: string;
  category: string;
  imageFile?: File | null;
  ingredients?: { name: string; quantity: string }[];
  steps?: { stepNumber?: number; instruction: string; imageUrl?: string }[];
}) {
  const form = new FormData();

  form.append("title", payload.title);
  if (payload.description) form.append("description", payload.description);
  if (payload.cookingTime) form.append("cookingTime", payload.cookingTime);
  if (payload.authorName) form.append("authorName", payload.authorName);
  form.append("category", payload.category);

  if (payload.imageFile) {
    form.append("image", payload.imageFile);
  }

  if (payload.ingredients) {
    form.append("ingredients", JSON.stringify(payload.ingredients));
  }

  if (payload.steps) {
    form.append("steps", JSON.stringify(payload.steps));
  }

  const res = await axiosClient.post("/recipes", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
