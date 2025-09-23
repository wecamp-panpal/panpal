import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, TextField, Button } from '@mui/material';
import { useAppSelector } from '@/hooks/use-app-selector';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

import DescriptionEditor from '@/components/recipes/text-editor';
import CategorySelectSingle from '@/components/recipes/category-select-single';
import AddIngredient from '@/components/recipes/add-ingredient';
import AddStep from '@/components/recipes/add-step';
import SimpleSuccessModal from '@/components/common/simple-success-modal';
import type { UIRecipe } from '@/types/ui-recipe';
import { getRecipeById, updateRecipe, updateRecipeImage } from '@/services/recipes';

const EditRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<UIRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [category, setCategory] = useState<UIRecipe['category']>('MAIN_DISH');
  const [ingredients, setIngredients] = useState<{ name: string; quantity: string }[]>([]);
  const [steps, setSteps] = useState<
    { step_number: number; instruction: string; image_url?: string }[]
  >([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  // Get current user from Redux store
  const { user, isAuthenticated } = useAppSelector(state => state.user);

  // Memoize onChange handlers to prevent infinite re-renders
  const handleIngredientsChange = useCallback(
    (newIngredients: { name: string; quantity: string }[]) => {
      setIngredients(newIngredients);
    },
    []
  );

  const handleStepsChange = useCallback(
    (newSteps: { stepNumber: number; instruction: string; imageUrl?: string }[]) => {
      const convertedSteps = newSteps.map(step => ({
        step_number: step.stepNumber,
        instruction: step.instruction,
        image_url: step.imageUrl,
      }));
      setSteps(convertedSteps);
    },
    []
  );

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id || !isAuthenticated) {
        navigate('/signin');
        return;
      }

      try {
        // Clean up old localStorage data
        if (localStorage.getItem('edited-recipes')) {
          localStorage.removeItem('edited-recipes');
        }

        const found = await getRecipeById(id);

        // Check if current user owns this recipe
        if (found.author_id !== user?.id) {
          navigate('/recipes/' + id); // Redirect back to detail page if not owner
          return;
        }

        setRecipe(found);
        setTitle(found.title);
        setDescription(found.description);
        setImagePreview(found.image); // Keep original image for preview
        setCategory(found.category);
        setIngredients(found.ingredients);
        setSteps(found.steps);

        // Extract minutes from cooking_time string (e.g., "30 mins" -> 30)
        const timeMatch = found.cooking_time.match(/(\d+)/);
        if (timeMatch) {
          setTotalMinutes(parseInt(timeMatch[1]));
        }
      } catch (error) {
        console.error('Error loading recipe:', error);
        navigate('/'); // Redirect to home if recipe not found or error
      }

      setLoading(false);
    };

    loadRecipe();
  }, [id, user?.id, isAuthenticated]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const newFile = event.target.files[0];
    const newImageUrl = URL.createObjectURL(newFile);
    setImageFile(newFile);
    setImagePreview(newImageUrl);
    event.target.value = '';
  };

  const handleSave = async () => {
    if (!recipe || !title.trim() || saving) {
      alert('Please fill in the recipe title');
      return;
    }

    setSaving(true);

    try {
      // Prepare updates data
      const updates = {
        title: title.trim(),
        description: description,
        cookingTime: `${totalMinutes} mins`,
        category: category,
        ingredients: ingredients,
        steps: steps.map(step => ({
          stepNumber: step.step_number,
          instruction: step.instruction,
          imageUrl: step.image_url,
        })),
      };

      // Update recipe data first
      let updatedRecipe = await updateRecipe(recipe.id, updates);

      // If there's a new image file, upload it separately
      if (imageFile) {
        updatedRecipe = await updateRecipeImage(recipe.id, imageFile);
      }

      // Dispatch custom event to notify other components about recipe update
      window.dispatchEvent(
        new CustomEvent('recipeUpdated', {
          detail: { recipeId: recipe.id, updatedRecipe },
        })
      );

      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating recipe:', error);
      alert('Failed to update recipe. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/recipes/' + id);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  const handleViewRecipe = () => {
    setShowSuccessModal(false);
    navigate('/recipes/' + id);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!recipe) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Typography>Recipe not found or you don't have permission to edit it.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography
        variant="h4"
        sx={{
          color: 'primary.main',
          fontWeight: 700,
          fontFamily: 'Playfair Display, serif',
          mb: 3,
        }}
      >
        Edit Recipe
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            color: 'primary.main',
            fontFamily: 'Montserrat',
            fontWeight: 600,
            mb: 2,
          }}
        >
          Basic Information
        </Typography>

        <Typography
          sx={{ color: 'primary.main', fontFamily: 'Montserrat', fontWeight: 500, mb: 0.75 }}
        >
          Title
        </Typography>
        <TextField
          fullWidth
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Input your recipe name..."
          sx={{
            mb: 2.5,
            '& .MuiOutlinedInput-root': {
              height: 40,
              borderRadius: 2,
              '& fieldset': {
                borderColor: 'secondary.main',
              },
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
            '& .MuiInputBase-input': {
              color: 'primary.main',
              fontFamily: 'Montserrat',
              '&::placeholder': {
                color: 'text.secondary',
                fontSize: 16,
                opacity: 0.7,
              },
            },
          }}
        />

        <Typography
          sx={{ color: 'primary.main', fontFamily: 'Montserrat', fontWeight: 500, mb: 0.75 }}
        >
          Description
        </Typography>
        <Box sx={{ mb: 3 }}>
          <DescriptionEditor value={recipe.description} onChange={html => setDescription(html)} />
        </Box>

        <Typography
          sx={{ color: 'primary.main', fontFamily: 'Montserrat', fontWeight: 500, mb: 0.75 }}
        >
          Recipe Picture
        </Typography>
        <Box
          sx={{
            border: '2px dashed',
            borderColor: 'secondary.main',
            borderRadius: 2,
            textAlign: 'center',
            py: 4,
            mb: 2,
            cursor: 'pointer',
            transition: 'all .2s ease',
            '&:hover': {
              borderColor: 'primary.main',
              opacity: 0.8,
            },
          }}
        >
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'inline-block' }}>
            <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography sx={{ color: 'primary.main', fontFamily: 'Montserrat', mt: 1 }}>
              Click to upload or drag and drop
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontFamily: 'Montserrat' }}
            >
              JPG, PNG, or GIF (max. 5MB)
            </Typography>
          </label>
        </Box>

        {imagePreview && (
          <Box sx={{ maxWidth: { xs: '100%', sm: '400px', md: '500px' } }}>
            <img
              src={imagePreview}
              alt="recipe preview"
              style={{
                width: '100%',
                height: 250,
                objectFit: 'cover',
                borderRadius: 12,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              }}
            />
          </Box>
        )}
      </Box>

      <Box>
        <Typography
          variant="h6"
          sx={{
            color: 'primary.main',
            fontFamily: 'Montserrat',
            fontWeight: 600,
            mb: 2,
          }}
        >
          Recipe Information
        </Typography>

        <Typography
          sx={{ color: 'primary.main', fontFamily: 'Montserrat', fontWeight: 500, mb: 0.75 }}
        >
          Total Time (minutes)
        </Typography>
        <TextField
          type="number"
          fullWidth
          value={totalMinutes}
          onChange={e => setTotalMinutes(Number(e.target.value))}
          sx={{
            mb: 2.5,
            '& .MuiOutlinedInput-root': {
              height: 40,
              borderRadius: 2,
              '& fieldset': {
                borderColor: 'secondary.main',
              },
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
            '& .MuiInputBase-input': {
              color: 'primary.main',
              fontFamily: 'Montserrat',
            },
          }}
        />

        <Typography
          sx={{ color: 'primary.main', fontFamily: 'Montserrat', fontWeight: 500, mb: 0.75 }}
        >
          Category
        </Typography>
        <Box sx={{ mb: 2.5 }}>
          <CategorySelectSingle
            initialValue={recipe.category}
            onChange={newCategory => setCategory(newCategory)}
          />
        </Box>

        <Typography
          sx={{ color: 'primary.main', fontFamily: 'Montserrat', fontWeight: 500, mb: 0.75 }}
        >
          Ingredient
        </Typography>
        <Box sx={{ mb: 2 }}>
          <AddIngredient
            initialIngredients={recipe.ingredients}
            onChange={handleIngredientsChange}
          />
        </Box>

        <Typography
          sx={{ color: 'primary.main', fontFamily: 'Montserrat', fontWeight: 500, mb: 0.75 }}
        >
          Steps
        </Typography>
        <AddStep
          initialSteps={recipe.steps.map(step => ({
            stepNumber: step.step_number,
            instruction: step.instruction,
            imageUrl: step.image_url,
          }))}
          onChange={handleStepsChange}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        <Button
          onClick={handleSave}
          disabled={saving}
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
            '&:focus': {
              outline: 'none',
              boxShadow: 'none',
            },
            '&:disabled': {
              backgroundColor: 'grey.300',
              color: 'grey.500',
            },
          }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          onClick={handleCancel}
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
          Cancel
        </Button>
      </Box>

      {/* Success Modal */}
      <SimpleSuccessModal
        open={showSuccessModal}
        onClose={handleSuccessModalClose}
        onButtonClick={handleViewRecipe}
        title="Recipe Updated!"
        message="Your recipe has been successfully updated and saved."
        buttonText="View Recipe"
      />
    </Container>
  );
};

export default EditRecipePage;
