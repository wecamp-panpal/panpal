const API_URL = "http://localhost:3000/api";

export async function getCommentsByRecipeId(recipeId: string) {
  const res = await fetch(`${API_URL}/comments?recipeId=${recipeId}`);
  if (!res.ok) throw new Error("Failed to fetch comments");

  const result = await res.json();
  return result.items ?? result;
}

export async function createComment(formData: FormData) {
  const res = await fetch(`${API_URL}/comments`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to post comment");
  return res.json();
}

export async function deleteCommentById(commentId: string) {
  const res = await fetch(`${API_URL}/comments/${commentId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete comment");
}
