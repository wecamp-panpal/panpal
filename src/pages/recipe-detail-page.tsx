import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Container,
  Skeleton,
  IconButton,
  Tooltip,
  Button,
  Chip,
  Avatar,
  Card,
  CardContent,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Edit,
  Delete,
  Share,
  Schedule,
  Person,
  Category,
} from '@mui/icons-material';
import type { UIRecipe } from '@/types/ui-recipe';
import type { User } from '@/types/user';
import { getRecipeById, deleteRecipe } from '@/services/recipes';
import { getCurrentUser } from '@/services/auth';
import { useFavorites } from '@/hooks/use-favourite';
import toast from 'react-hot-toast';
import RatingDistribution from '@/components/rating/rating-distribution';
import CommentCard from '@/components/rating/comment-card';
import CommentForm from '@/components/rating/comment-form';
import {
  getComments,
  getRatingSummary,
  canUserRate,
  getUserRating,
  createCommentWithImages,
  updateComment,
  deleteComment,
  toggleHelpful,
  type Comment,
  type RatingSummary,
} from '@/services/comments-new';

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [recipe, setRecipe] = useState<UIRecipe | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState<Comment[]>([]);
  const [ratingSummary, setRatingSummary] = useState<RatingSummary | null>(null);
  const [userRating, setUserRating] = useState<Comment | null>(null);
  const [canRate, setCanRate] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const { favorites, handleToggleFavorite } = useFavorites();

  const loadRecipeData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const shouldBustCache =
        location.search.includes('updated=') || location.search.includes('refresh=');
      const fetchedRecipe = await getRecipeById(id, shouldBustCache);
      setRecipe(fetchedRecipe);
    } catch (err) {
      console.error('Failed to load recipe:', err);
      toast.error('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  }, [id, location.search]);

  const loadCommentsData = useCallback(async () => {
    if (!id) return;

    try {
      setCommentsLoading(true);

      const [commentsData, summaryData, userRatingData, canRateData] = await Promise.all([
        getComments({ recipeId: id, type: 'all', sortBy: 'newest' }),
        getRatingSummary(id),
        currentUser ? getUserRating(id) : Promise.resolve(null),
        currentUser ? canUserRate(id) : Promise.resolve({ canRate: false }),
      ]);

      setComments(commentsData.items);
      setRatingSummary(summaryData);
      setUserRating(userRatingData);
      setCanRate(canRateData.canRate);
    } catch (err) {
      console.error('Failed to load comments data:', err);
    } finally {
      setCommentsLoading(false);
    }
  }, [id, currentUser]);

  useEffect(() => {
    getCurrentUser()
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null));
  }, []);

  useEffect(() => {
    if (!id) return;
    loadRecipeData();
  }, [id, location.search, loadRecipeData]);

  useEffect(() => {
    if (id && currentUser) {
      loadCommentsData();
    }
  }, [id, currentUser, loadCommentsData]);

  const handleCreateComment = async (
    data: { recipeId: string; content: string; rating?: number },
    images?: File[]
  ) => {
    if (!id) return;

    try {
      await createCommentWithImages(data, images);
      await loadCommentsData();
      setShowCommentForm(false);
    } catch (err) {
      console.error('Failed to create comment:', err);
      throw err;
    }
  };

  const handleUpdateComment = async (data: { content: string; rating?: number }) => {
    if (!editingComment) return;

    try {
      await updateComment(editingComment.id, {
        content: data.content,
        rating: data.rating,
      });
      await loadCommentsData();
      setEditingComment(null);
    } catch (err) {
      console.error('Failed to update comment:', err);
      throw err;
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this comment?');
    if (!confirmed) return;

    try {
      await deleteComment(commentId);
      await loadCommentsData();
      toast.success('Comment deleted successfully');
    } catch (err) {
      console.error('Failed to delete comment:', err);
      toast.error('Failed to delete comment');
    }
  };

  const handleToggleHelpful = async (commentId: string) => {
    try {
      await toggleHelpful(commentId);
      await loadCommentsData();
    } catch (err) {
      console.error('Failed to toggle helpful:', err);
      toast.error('Something went wrong');
    }
  };

  const handleFavoriteClick = async () => {
    if (!currentUser) {
      navigate('/sign-in');
      return;
    }
    if (id) {
      await handleToggleFavorite(id);
    }
  };

  const handleEditRecipe = () => {
    navigate(`/recipes/${id}/edit`);
  };

  const handleDeleteRecipe = async () => {
    if (!recipe || !currentUser || !isOwner) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this recipe? This action cannot be undone.'
    );

    if (confirmed) {
      try {
        await deleteRecipe(recipe.id);
        window.dispatchEvent(
          new CustomEvent('recipeDeleted', {
            detail: { recipeId: recipe.id },
          })
        );
        toast.success('Recipe deleted successfully');
        navigate('/profile?tab=1');
      } catch {
        toast.error('Failed to delete recipe');
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe?.title,
          text: `Check out this amazing recipe: ${recipe?.title} on PanPal`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const isOwner = currentUser?.id && recipe?.author_id === currentUser.id;

  if (loading) {
    return (
      <Box sx={{ backgroundColor: '#F5E2CC', minHeight: '100vh' }}>
        <Container maxWidth="md" sx={{ pt: 4, pb: 8 }}>
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3, mb: 4 }} />
          <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="text" height={30} width="60%" sx={{ mb: 4 }} />
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
        </Container>
      </Box>
    );
  }

  if (!recipe) {
    return (
      <Box
        sx={{
          backgroundColor: '#F5E2CC',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{ fontFamily: '"Playfair Display", serif', color: '#391F06', mb: 2 }}
          >
            Recipe Not Found
          </Typography>
          <Button
            onClick={() => navigate('/')}
            variant="contained"
            sx={{
              textTransform: 'none',
              backgroundColor: 'primary.main',
              color: 'secondary.main',
              px: 4,
              py: 1.25,
              borderRadius: 3,
              fontFamily: 'Montserrat',
              fontWeight: 700,
              '&:hover': {
                backgroundColor: 'secondary.main',
                color: 'primary.main',
              },
            }}
          >
            Back to Home
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#F5E2CC', minHeight: '100vh' }}>
      <Box
        sx={{
          position: 'relative',
          height: { xs: '300px', md: '500px' },
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${recipe.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', color: '#fff' }}>
            <Typography
              variant="h1"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 700,
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              {recipe.title}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                flexWrap: 'wrap',
                mt: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person sx={{ fontSize: '1.2rem' }} />
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                  by {recipe.author_name}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule sx={{ fontSize: '1.2rem' }} />
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                  {recipe.cooking_time}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Category sx={{ fontSize: '1.2rem' }} />
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                  {recipe.category}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>

        <Box
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            display: 'flex',
            gap: 1,
          }}
        >
          <Tooltip title="Share Recipe">
            <IconButton
              onClick={handleShare}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#391F06',
                '&:hover': { backgroundColor: '#fff', transform: 'scale(1.1)' },
                transition: 'all 0.2s ease',
              }}
            >
              <Share />
            </IconButton>
          </Tooltip>

          <Tooltip title={favorites.includes(id!) ? 'Remove from Favorites' : 'Add to Favorites'}>
            <IconButton
              onClick={handleFavoriteClick}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: favorites.includes(id!) ? '#dc3545' : '#391F06',
                '&:hover': { backgroundColor: '#fff', transform: 'scale(1.1)' },
                transition: 'all 0.2s ease',
              }}
            >
              {favorites.includes(id!) ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Tooltip>

          {isOwner && (
            <>
              <Tooltip title="Edit Recipe">
                <IconButton
                  onClick={handleEditRecipe}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#391F06',
                    '&:hover': { backgroundColor: '#fff', transform: 'scale(1.1)' },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete Recipe">
                <IconButton
                  onClick={handleDeleteRecipe}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#dc2626',
                    '&:hover': { backgroundColor: '#fff', transform: 'scale(1.1)' },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar
                sx={{
                  backgroundColor: '#D4A574',
                  width: 56,
                  height: 56,
                  fontSize: '1.5rem',
                  fontWeight: 600,
                }}
              >
                {recipe.author_name.charAt(0).toUpperCase()}
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '1.125rem',
                    color: '#1a202c',
                  }}
                >
                  {recipe.author_name}
                </Typography>
                <Typography sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                  Recipe Author
                </Typography>
              </Box>

              <Chip
                icon={<Category />}
                label={recipe.category}
                sx={{
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  fontWeight: 600,
                }}
              />
            </Box>

            {ratingSummary && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    sx={{
                      fontSize: '2rem',
                      fontWeight: 700,
                      color: '#D4A574',
                      fontFamily: '"Playfair Display", serif',
                    }}
                  >
                    {ratingSummary.averageRating.toFixed(1)}
                  </Typography>
                  <Typography sx={{ color: '#64748b', fontSize: '0.875rem' }}>/ 5 stars</Typography>
                </Box>

                <Typography sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                  ({ratingSummary.totalRatings.toLocaleString()} reviews)
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                color: '#1a202c',
                mb: 3,
                fontSize: '1.875rem',
              }}
            >
              About This Recipe
            </Typography>

            <Box
              sx={{
                '& p': {
                  fontSize: '1.125rem',
                  lineHeight: 1.8,
                  color: '#374151',
                  mb: 2,
                },
                '& h1, & h2, & h3': {
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  color: '#1a202c',
                  mb: 2,
                },
                '& ul, & ol': {
                  mb: 2,
                  pl: 3,
                  '& li': {
                    fontSize: '1.125rem',
                    lineHeight: 1.8,
                    color: '#374151',
                    mb: 0.5,
                  },
                },
              }}
              dangerouslySetInnerHTML={{ __html: recipe.description }}
            />
          </CardContent>
        </Card>

        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                color: '#1a202c',
                mb: 3,
                fontSize: '1.875rem',
              }}
            >
              Ingredients
            </Typography>

            <Box sx={{ display: 'grid', gap: 2 }}>
              {recipe.ingredients.map((ing, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    backgroundColor: '#f8fafc',
                    borderRadius: 2,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      backgroundColor: '#D4A574',
                      borderRadius: '50%',
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '1.125rem',
                      color: '#374151',
                      flex: 1,
                    }}
                  >
                    <strong>{ing.name}:</strong> {ing.quantity}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mb: 6, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                color: '#1a202c',
                mb: 3,
                fontSize: '1.875rem',
              }}
            >
              Instructions
            </Typography>

            <Box sx={{ display: 'grid', gap: 3 }}>
              {recipe.steps.map(step => (
                <Box
                  key={step.step_number}
                  sx={{
                    display: 'flex',
                    gap: 3,
                    p: 3,
                    backgroundColor: '#f8fafc',
                    borderRadius: 2,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: '#D4A574',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '1.125rem',
                    }}
                  >
                    {step.step_number}
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '1.125rem',
                        lineHeight: 1.8,
                        color: '#374151',
                        mb: step.image_url ? 2 : 0,
                      }}
                    >
                      {step.instruction}
                    </Typography>

                    {step.image_url && (
                      <Box
                        component="img"
                        src={step.image_url}
                        alt={`Step ${step.step_number}`}
                        sx={{
                          width: '100%',
                          maxWidth: 400,
                          height: 'auto',
                          borderRadius: 2,
                          border: '1px solid #e2e8f0',
                        }}
                      />
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {ratingSummary && <RatingDistribution stats={ratingSummary} />}

        {currentUser && (canRate || userRating) && (
          <Box sx={{ mb: 4 }}>
            {!showCommentForm && !editingComment ? (
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography
                    sx={{
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: 'primary.main',
                      mb: 2,
                      fontFamily: 'Montserrat',
                    }}
                  >
                    Share Your Experience
                  </Typography>
                  <Button
                    onClick={() => setShowCommentForm(true)}
                    variant="contained"
                    sx={{
                      textTransform: 'none',
                      backgroundColor: 'primary.main',
                      color: 'secondary.main',
                      px: 4,
                      py: 1.25,
                      borderRadius: 3,
                      fontFamily: 'Montserrat',
                      fontWeight: 700,
                      fontSize: '1rem',
                      '&:hover': {
                        backgroundColor: 'secondary.main',
                        color: 'primary.main',
                      },
                      '&:focus': {
                        outline: 'none',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    Write a Review
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <CommentForm
                recipeId={id!}
                onSubmit={editingComment ? handleUpdateComment : handleCreateComment}
                onCancel={() => {
                  setShowCommentForm(false);
                  setEditingComment(null);
                }}
                initialData={editingComment || undefined}
                isEdit={!!editingComment}
                showRating={canRate && !userRating}
              />
            )}
          </Box>
        )}

        {!currentUser && (
          <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'primary.main',
                  mb: 2,
                  fontFamily: 'Montserrat',
                }}
              >
                Want to Rate This Recipe?
              </Typography>
              <Typography
                sx={{
                  fontSize: '1rem',
                  color: '#64748b',
                  mb: 3,
                  fontFamily: 'Montserrat',
                }}
              >
                Join PanPal to share your cooking experience and help other food lovers!
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  onClick={() => navigate('/sign-in')}
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    backgroundColor: 'primary.main',
                    color: 'secondary.main',
                    px: 4,
                    py: 1.25,
                    borderRadius: 3,
                    fontFamily: 'Montserrat',
                    fontWeight: 700,
                    fontSize: '1rem',
                    '&:hover': {
                      backgroundColor: 'secondary.main',
                      color: 'primary.main',
                    },
                    '&:focus': {
                      outline: 'none',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Sign In to Review
                </Button>
                <Button
                  onClick={() => navigate('/sign-up')}
                  variant="outlined"
                  sx={{
                    textTransform: 'none',
                    color: 'primary.main',
                    backgroundColor: 'secondary.main',
                    border: '1.5px solid',
                    borderColor: 'primary.main',
                    px: 4,
                    py: 1.25,
                    borderRadius: 3,
                    fontFamily: 'Montserrat',
                    fontWeight: 600,
                    fontSize: '1rem',
                    '&:hover': {
                      borderColor: 'secondary.main',
                      backgroundColor: 'secondary.main',
                      color: 'primary.main',
                    },
                    '&:focus': {
                      outline: 'none',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Join PanPal
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        <Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              color: '#1a202c',
              mb: 4,
              fontSize: '1.875rem',
              textAlign: 'center',
            }}
          >
            Community Reviews
          </Typography>

          {commentsLoading ? (
            <Box sx={{ display: 'grid', gap: 3 }}>
              {[1, 2, 3].map(i => (
                <Skeleton key={i} variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
              ))}
            </Box>
          ) : comments.length > 0 ? (
            <Box>
              {comments.map(comment => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  currentUserId={currentUser?.id}
                  onToggleHelpful={handleToggleHelpful}
                  onEdit={setEditingComment}
                  onDelete={handleDeleteComment}
                />
              ))}
            </Box>
          ) : (
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 6, textAlign: 'center' }}>
                <Typography
                  sx={{
                    fontSize: '1.125rem',
                    color: '#64748b',
                    fontStyle: 'italic',
                  }}
                >
                  No reviews yet. Be the first to share your experience with this recipe!
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Container>
    </Box>
  );
}
