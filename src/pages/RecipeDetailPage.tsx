import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Typography, Rating, Skeleton, IconButton, Tooltip, Button, Collapse } from "@mui/material";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Delete } from "@mui/icons-material";
import { Favorite, FavoriteBorder, Edit } from "@mui/icons-material";
import type { UIRecipe } from "@/types/ui-recipe";
import type { User } from "@/types/user";
import { getRecipeById } from "@/services/recipes";
import { getCurrentUser } from "@/services/auth";
import { getCommentsByRecipeId, createComment, deleteCommentById } from "@/services/comments";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [recipe, setRecipe] = useState<UIRecipe | null>(null);
  const [comments, setComments] = useState<Array<{
    id: string;
    user_id: string;
    user?: { id: string; name: string };
    content: string;
    rating: number;
    image_url?: string;
    created_at: string;
    updated_at: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState<number | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  // Listen for favorite changes to keep heart icon in sync
  useEffect(() => {
    const handleFavoriteChange = (event: CustomEvent) => {
      const { recipeId: changedRecipeId, isFavorited: newStatus } = event.detail;
      if (changedRecipeId === Number(id)) {
        setIsFavorited(newStatus);
      }
    };

    window.addEventListener('favoriteChanged', handleFavoriteChange as EventListener);
    
    return () => {
      window.removeEventListener('favoriteChanged', handleFavoriteChange as EventListener);
    };
  }, [id]);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [isEditedVersion, setIsEditedVersion] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    getCurrentUser().then(setCurrentUser).catch(() => setCurrentUser(null));
  }, []);

  useEffect(() => {
    if (!id) return;
    const recipeId = id;

  async function loadData() {
    try {
        const [fetchedRecipe, fetchedComments] = await Promise.all([
          getRecipeById(Number(recipeId)),
          getCommentsByRecipeId(recipeId),
        ]);

        setRecipe(fetchedRecipe);
        setComments(fetchedComments);

        try {
          const user = await getCurrentUser();
          setCurrentUser(user);
        } catch {
          setCurrentUser(null);
        }

        let recipeData = fetchedRecipe;
        const editedRecipesData = localStorage.getItem("edited-recipes");
        if (editedRecipesData) {
          const editedRecipes = JSON.parse(editedRecipesData);
          if (editedRecipes[recipeId]) {
            recipeData = editedRecipes[recipeId];
            setIsEditedVersion(true);
          }
        }

        setRecipe(recipeData);
        setComments(fetchedComments);

        // Check favorite status from localStorage (this may have been updated during recipe conversion)
        const saved = localStorage.getItem("favorite-recipes");
        if (saved) {
          const favoriteIds = JSON.parse(saved);
          setIsFavorited(favoriteIds.includes(Number(recipeId)));
        }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
      loadData();
  }, [id, location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    if(!currentUser) return;
    e.preventDefault();
    if (!newRating || !newComment.trim()) return;

    const formData = new FormData();
    formData.append("recipe_id", id ?? "");
    formData.append("user_id", currentUser?.id || "");
    formData.append("user_name", currentUser?.name || "");
    formData.append("rating", newRating.toString());
    formData.append("content", newComment);
    if (newImage) formData.append("image", newImage);

    const created = await createComment(formData);
    setComments((prev) => [created, ...prev]);
    setNewComment("");
    setNewRating(null);
    setNewImage(null);
  };

  const handleToggleFavorite = async () => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    const recipeId = Number(id);
    const wasCurrentlyFavorited = isFavorited;
    
    // Optimistic update
    setIsFavorited(!isFavorited);
    
    try {
      // Import and use favoriteService
      const { favoriteService } = await import('@/services/favorites');
      await favoriteService.toggleFavorite(recipeId, wasCurrentlyFavorited);
      
      console.log(`${wasCurrentlyFavorited ? 'Removed from' : 'Added to'} favorites:`, recipe?.title);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert optimistic update on error
      setIsFavorited(wasCurrentlyFavorited);
      alert('Failed to update favorite status. Please try again.');
    }
  };

  const handleEditRecipe = () => {
    navigate(`/recipes/${id}/edit`);
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteCommentById(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };
  // Check if current user owns this recipe
  const isOwner = currentUser?.id && recipe?.author_id === currentUser.id;

  if (loading) {
    return <Skeleton variant="rectangular" height={400} />;
  }

  if (!recipe) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4">Recipe not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h3"
            sx={{ fontFamily: '"Playfair Display", serif' }}
          >
            {recipe.title}
          </Typography>
          {isEditedVersion && (
            <Typography
              variant="body2"
              sx={{
                color: '#2e7d32',
                fontFamily: 'Montserrat',
                fontWeight: 500,
                mt: 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              This recipe has been edited
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isFavorited && (
            <Typography
              sx={{
                fontFamily: 'Montserrat',
                fontSize: '1rem',
                color: '#dc3545',
                fontWeight: 500,
              }}
            >
              Added to favorites
            </Typography>
          )}
          
          {/* Show edit button only if user owns this recipe */}
          {isOwner && (
            <Tooltip title="Edit Recipe">
              <Button
                onClick={handleEditRecipe}
                startIcon={<Edit />}
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'secondary.main',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  fontFamily: 'Montserrat',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'secondary.main',
                    color: 'primary.main',
                    transform: 'scale(1.05)',
                  },
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                  transition: 'all 0.2s ease',
                  mr: 1,
                }}
              >
                Edit Recipe
              </Button>
            </Tooltip>
          )}
          
          <Tooltip title={isFavorited ? "Remove from favorites" : "Add to favorites"}>
            <IconButton
              onClick={handleToggleFavorite}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(4px)',
                border: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  transform: 'scale(1.1)',
                },
                '&:focus': {
                  outline: 'none',
                  boxShadow: 'none',
                },
                transition: 'all 0.2s ease',
                width: 56,
                height: 56,
              }}
            >
              {isFavorited ? (
                <Favorite sx={{ color: '#dc3545', fontSize: 28 }} />
              ) : (
                <FavoriteBorder sx={{ color: '#8B6B47', fontSize: 28 }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box
        component="img"
        src={recipe.image}
        alt={recipe.title}
        sx={{
          width: "100%",
          maxHeight: 400,
          objectFit: "cover",
          borderRadius: 4,
          mb: 3,
        }}
      />

      <Box 
        sx={{ 
          mb: 3,
          '& p': { margin: 0, mb: 1 },
          '& h1, & h2, & h3': { mb: 1 },
          '& ul, & ol': { mb: 1, pl: 2 },
          fontFamily: 'Montserrat'
        }}
        dangerouslySetInnerHTML={{ __html: recipe.description }}
      />

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Rating
          value={recipe.rating_avg}
          precision={0.1}
          readOnly
          sx={{ "& .MuiRating-iconFilled": { color: "#D4A574" } }}
        />
        <Typography>
          {recipe.rating_avg} ({recipe.rating_count})
        </Typography>
      </Box>

      <Typography variant="body1" sx={{ mb: 1 }}>
        <strong>Author:</strong> {recipe.author_name}
      </Typography>

      <Typography variant="body1" sx={{ mb: 1 }}>
        <strong>Category:</strong> {recipe.category}
      </Typography>

      <Typography variant="body1" sx={{ mb: 1 }}>
        <strong>Cook Time:</strong> {recipe.cooking_time}
      </Typography>

      <Typography variant="h5" sx={{ mt: 4, mb: 1 }}>
        Ingredients
      </Typography>
      <Box component="ul" sx={{ pl: 3 }}>
        {recipe.ingredients.map((ing, idx) => (
          <li key={idx}>
            <Typography variant="body2">
              {ing.name}: {ing.quantity}
            </Typography>
          </li>
        ))}
      </Box>

      <Typography variant="h5" sx={{ mt: 4, mb: 1 }}>
        Instructions
      </Typography>
      <Box component="ol" sx={{ pl: 3 }}>
        {recipe.steps.map((step) => (
          <li key={step.step_number} style={{ marginBottom: '1rem' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">{step.instruction}</Typography>
              {step.image_url && (
                <IconButton
                  size="small"
                  onClick={() =>
                    setExpandedStep((prev) =>
                      prev === step.step_number ? null : step.step_number
                    )
                  }
                  sx={{ color: '#8B6B47' }}
                >
                  {expandedStep === step.step_number ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </IconButton>
              )}
            </Box>

            {step.image_url && (
              <Collapse in={expandedStep === step.step_number}>
                <Box sx={{ display: 'block', textAlign: 'left' }}>
                  <Box
                    component="img"
                    src={step.image_url}
                    alt={`Step ${step.step_number} image`}
                    sx={{
                      mt: 1,
                      maxHeight: 300,
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                      margin: '0 !important',
                    }}
                  />
                </Box>
              </Collapse>
            )}
          </li>
        ))}
      </Box>

      <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
        Comments
      </Typography>

      {comments.map((c) => (
        <Box key={c.id} sx={{ borderRadius: 3, border: "1px solid #ddd", p: 2, mb: 2, backgroundColor: "#fff" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography fontWeight={600}>{c.user?.name ?? "Unknown"}</Typography>
            <Typography fontSize={12} color="text.secondary">
              {new Date(c.created_at).toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Rating value={c.rating} precision={0.1} size="small" readOnly />
            <Typography fontSize={14}>{c.rating}</Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: c.image_url ? 2 : 0 }}>{c.content}</Typography>
          {c.image_url && (
            <Box component="img" src={c.image_url} alt="Comment image" sx={{ maxWidth: "100%", borderRadius: 2 }} />
          )}
          {c.user?.id === currentUser?.id && (
            <Button
              onClick={() => handleDeleteComment(c.id)}
              color="error"
              size="small"
              sx={{ mt: 1 }}
              startIcon={<Delete />}
            >
              Delete
            </Button>
          )}
        </Box>
      ))}

      <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
        Leave a Comment
      </Typography>

      {currentUser ? (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, border: "1px solid #ddd", borderRadius: 3, p: 3, backgroundColor: "#fff" }}>
          <Rating value={newRating} precision={0.1} onChange={(_, val) => setNewRating(val)} />
          <textarea
            placeholder="Write your comment..."
            required
            style={{ resize: "vertical", padding: "8px", minHeight: "80px", fontSize: "0.95rem", borderRadius: "6px", border: "1px solid #ccc", fontFamily: "inherit" }}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Box>
            <Typography fontSize={14} sx={{ mb: 1 }}>Optional image:</Typography>
            <input type="file" accept="image/*" onChange={(e) => setNewImage(e.target.files?.[0] || null)} />
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <button
              type="submit"
              style={{ backgroundColor: "#8B6B47", color: "#fff", padding: "8px 16px", border: "none", borderRadius: "6px", fontWeight: 500, fontSize: "0.95rem", cursor: "pointer" }}
            >
              Submit
            </button>
          </Box>
        </Box>
      ) : (
        <Typography sx={{ fontStyle: "italic", color: "#555" }}>
          Please log in to leave a comment.
        </Typography>
      )}
    </Box>
  );
}