import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Typography, Rating, Skeleton, IconButton, Tooltip } from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import type { UIRecipe } from "@/types/ui-recipe";
import { makeMockRecipes } from "@/mocks/recipes.mock";
import { makeMockComments, type MockComment } from "@/mocks/comments.mock";
import Collapse from "@mui/material/Collapse";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<UIRecipe | null>(null);
  const [comments, setComments] = useState<MockComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState<number | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  useEffect(() => {
    const recipeId = Number(id);
    const all = makeMockRecipes(60);
    const found = all.find((r) => r.id === recipeId);
    setRecipe(found || null);
    setComments(makeMockComments(id ?? ''));
    
    // Load favorites from localStorage and check if this recipe is favorited
    const saved = localStorage.getItem('favorite-recipes');
    if (saved) {
      try {
        const favoriteIds = JSON.parse(saved);
        setIsFavorited(favoriteIds.includes(recipeId));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
    
    setLoading(false);
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRating || !newComment.trim()) return;

    const comment: MockComment = {
      id: crypto.randomUUID(),
      recipe_id: id ?? "",
      user_id: "mock-user",
      user_name: "You",
      content: newComment,
      rating: newRating,
      image_url: newImage ? URL.createObjectURL(newImage) : undefined,
      created_at: new Date().toISOString(),
    };

    setComments((prev) => [comment, ...prev]);
    setNewComment("");
    setNewRating(null);
    setNewImage(null);
  };

  const handleToggleFavorite = () => {
    const recipeId = Number(id);
    setIsFavorited(!isFavorited);
    
    // Update localStorage
    const saved = localStorage.getItem('favorite-recipes');
    let favoriteIds: number[] = [];
    
    if (saved) {
      try {
        favoriteIds = JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing favorites:', error);
      }
    }
    
    if (!isFavorited) {
      // Add to favorites
      if (!favoriteIds.includes(recipeId)) {
        favoriteIds.push(recipeId);
        console.log('Added to favorites:', recipe?.title);
      }
    } else {
      // Remove from favorites
      favoriteIds = favoriteIds.filter(id => id !== recipeId);
      console.log('Removed from favorites:', recipe?.title);
    }
    
    localStorage.setItem('favorite-recipes', JSON.stringify(favoriteIds));
  };

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
        <Typography
          variant="h3"
          sx={{ fontFamily: '"Playfair Display", serif', flex: 1 }}
        >
          {recipe.title}
        </Typography>
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

      <Typography variant="body1" sx={{ mb: 3 }}>
        {recipe.description}
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
        <Box
          key={c.id}
          sx={{
            borderRadius: 3,
            border: "1px solid #ddd",
            p: 2,
            mb: 2,
            backgroundColor: "#fff",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography fontWeight={600}>{c.user_name}</Typography>
            <Typography fontSize={12} color="text.secondary">
              {new Date(c.created_at).toLocaleString()}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Rating value={c.rating} precision={0.1} size="small" readOnly />
            <Typography fontSize={14}>{c.rating}</Typography>
          </Box>

          <Typography variant="body2" sx={{ mb: c.image_url ? 2 : 0 }}>
            {c.content}
          </Typography>

          {c.image_url && (
            <Box
              component="img"
              src={c.image_url}
              alt="Comment image"
              sx={{ maxWidth: "100%", borderRadius: 2 }}
            />
          )}
        </Box>
      ))}

      <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
        Leave a Comment
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          border: "1px solid #ddd",
          borderRadius: 3,
          p: 3,
          backgroundColor: "#fff",
        }}
      >
        <Rating
          value={newRating}
          precision={0.1}
          onChange={(_, val) => setNewRating(val)}
        />

        <textarea
          placeholder="Write your comment..."
          required
          style={{
            resize: "vertical",
            padding: "8px",
            minHeight: "80px",
            fontSize: "0.95rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontFamily: "inherit",
          }}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />

        <Box>
          <Typography fontSize={14} sx={{ mb: 1 }}>
            Optional image:
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewImage(e.target.files?.[0] || null)}
          />
        </Box>

        <Box sx={{ textAlign: "right" }}>
          <button
            type="submit"
            style={{
              backgroundColor: "#8B6B47",
              color: "#fff",
              padding: "8px 16px",
              border: "none",
              borderRadius: "6px",
              fontWeight: 500,
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </Box>
      </Box>
    </Box>
  );
}