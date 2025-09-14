import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, TextField, Button } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

import DescriptionEditor from '@/components/text-editor/text-editor';
import CategorySelectSingle from '@/components/category-select-single/CategorySelectSingle';
import AddIngredient from '@/components/add-ingredients/add-ingredient';
import AddStep from '@/components/add-step/add-step';
import SimpleSuccessModal from '@/components/success-modal/SimpleSuccessModal';
import type { UIRecipe } from '@/types/ui-recipe';
import { makeMockRecipes } from '@/mocks/recipes.mock';

const EditRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<UIRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [category, setCategory] = useState<UIRecipe['category']>('Main Dish');
  const [ingredients, setIngredients] = useState<{name: string; quantity: string}[]>([]);
  const [steps, setSteps] = useState<{step_number: number; instruction: string; image_url?: string}[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Mock current user
  const currentUser = "Chef A";

  useEffect(() => {
    const recipeId = Number(id);
    const all = makeMockRecipes(60);
    const found = all.find((r) => r.id === recipeId);
    
    if (found) {
      // Check if current user owns this recipe
      if (found.author_name !== currentUser) {
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
    } else {
      navigate('/'); // Redirect to home if recipe not found
    }
    
    setLoading(false);
  }, [id, navigate, currentUser]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const newFile = event.target.files[0];
    const newImageUrl = URL.createObjectURL(newFile);
    setImagePreview(newImageUrl);
    console.log('New image uploaded:', newImageUrl);
    event.target.value = '';
  };

  const handleSave = () => {
    if (!recipe || !title.trim()) {
      alert('Please fill in the recipe title');
      return;
    }

    // Create updated recipe object
    const updatedRecipe: UIRecipe = {
      ...recipe,
      title: title.trim(),
      description: description,
      cooking_time: `${totalMinutes} mins`,
      category: category,
      ingredients: ingredients,
      steps: steps,
      image: (imagePreview && imagePreview.trim()) || recipe.image,
    };

    console.log('Debug - imagePreview:', imagePreview);
    console.log('Debug - recipe.image:', recipe.image);
    console.log('Debug - final image:', updatedRecipe.image);

    // In a real app, this would be an API call
    console.log('Saving recipe updates:', updatedRecipe);
    
    // save to localStorage to demonstrate
    const savedRecipes = localStorage.getItem('edited-recipes');
    const editedRecipes = savedRecipes ? JSON.parse(savedRecipes) : {};
    editedRecipes[recipe.id] = updatedRecipe;
    localStorage.setItem('edited-recipes', JSON.stringify(editedRecipes));
    
    // Show success modal
    setShowSuccessModal(true);
  };

  const handleCancel = () => {
    navigate('/recipes/' + id);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Navigate back and force a refresh by adding timestamp
    navigate('/recipes/' + id + '?updated=' + Date.now());
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
          onChange={(e) => setTitle(e.target.value)}
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
          <DescriptionEditor 
            value={recipe.description} 
            onChange={(html) => setDescription(html)}
          />
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
            onChange={(newCategory) => setCategory(newCategory)}
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
            onChange={(newIngredients) => setIngredients(newIngredients)}
          />
        </Box>

        <Typography
          sx={{ color: 'primary.main', fontFamily: 'Montserrat', fontWeight: 500, mb: 0.75 }}
        >
          Steps
        </Typography>
        <AddStep 
          initialSteps={recipe.steps} 
          onChange={(newSteps) => setSteps(newSteps)}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        <Button
          onClick={handleSave}
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
              color: 'primary.main'
            },
            '&:focus': {
              outline: 'none',
              boxShadow: 'none'
            }
          }}
        >
          Save Changes
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
              color: 'primary.main'
            },
            '&:focus': {
              outline: 'none',
              boxShadow: 'none'
            }
          }}
        >
          Cancel
        </Button>
      </Box>

      {/* Success Modal */}
      <SimpleSuccessModal
        open={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Recipe Updated!"
        message="Your recipe has been successfully updated and saved."
        buttonText="View Recipe"
      />
    </Container>
  );
};

export default EditRecipePage;
