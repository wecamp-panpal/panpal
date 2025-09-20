import { useState } from 'react';
import { Box, Container, Typography, TextField, Button } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import DescriptionEditor from '@/components/text-editor/text-editor';
import CategorySelect, { type RecipeCategory } from '@/components/category-select/category-select';
import AddIngredient from '@/components/add-ingredients/add-ingredient';
import AddStep from '@/components/add-step/add-step';
import axiosClient from '@/lib/axiosClient';
import { clearCurrentUserCache } from '@/services/auth';
import { toast } from 'react-hot-toast';

const AddRecipePage = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RecipeCategory | null>(null);
  const [ingredients, setIngredients] = useState<{ name: string; quantity: string }[]>([]);
  const [steps, setSteps] = useState<
    { stepNumber: number; instruction: string; imageUrl?: string; file?: File }[]
  >([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const f = event.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
    event.target.value = '';
  };

  const handleSubmit = async () => {
    try {
      if (!title.trim()) return alert('Missing title');
      if (!category) return alert('Please choose a category');

      const form = new FormData();
      form.append('title', title);
      form.append('description', description);
      form.append('category', category);
      form.append('cookingTime', `${totalMinutes} minutes`);
      if (imageFile) form.append('image', imageFile);

      ingredients.forEach((ing, i) => {
        form.append(`ingredients[${i}][name]`, ing.name);
        form.append(`ingredients[${i}][quantity]`, ing.quantity);
      });

      const textSteps = steps.filter(s => s.instruction?.trim());
      textSteps.forEach((st, i) => {
        form.append(`steps[${i}][stepNumber]`, String(i + 1));
        form.append(`steps[${i}][instruction]`, st.instruction.trim());
      });

      const createRes = await axiosClient.post('/recipes', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const created = createRes.data as {
        id: string;
        steps?: { id: string; stepNumber: number }[];
      };

      const recipeId = created.id;
      const createdSteps = created.steps ?? [];

      const jobs = createdSteps.map(async beStep => {
        const feStep =
          textSteps.find(s => s.stepNumber === beStep.stepNumber) ??
          textSteps[beStep.stepNumber - 1];
        if (!feStep?.file) return;
        const fd = new FormData();
        fd.append('stepImage', feStep.file);
        await axiosClient.post(`/recipes/${recipeId}/steps/${beStep.id}/image`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      });

      await Promise.all(jobs);

      clearCurrentUserCache();
      toast.success('Recipe create successfully');
      navigate('/profile?tab=1');
    } catch (err: any) {
      console.error(err?.response?.data || err);
      toast.error('Failed to create recipe');
    }
  };
  const handleCancel = () => {
    const hasContent =
      title ||
      description ||
      category ||
      totalMinutes > 0 ||
      ingredients.length > 0 ||
      steps.length > 0 ||
      imageFile;

    if (hasContent) {
      const confirmed = window.confirm(
        'Are you sure you want to clear all fields? This action cannot be undone.'
      );

      if (confirmed) {
        setTitle('');
        setDescription('');
        setCategory(null);
        setTotalMinutes(0);
        setIngredients([]);
        setSteps([]);
        setImageFile(null);
        setImagePreview(null);
        toast.success('All fields cleared');
      }
      return;
    }

    setTitle('');
    setDescription('');
    setCategory(null);
    setTotalMinutes(0);
    setIngredients([]);
    setSteps([]);
    setImageFile(null);
    setImagePreview(null);
    toast.success('All fields cleared');
  };

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
        Add New Recipe
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
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <Typography
          sx={{ color: 'primary.main', fontFamily: 'Montserrat', fontWeight: 500, mb: 0.75 }}
        >
          Description
        </Typography>
        <Box sx={{ mb: 3 }}>
          <DescriptionEditor value={description} onChange={setDescription} />
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
          <CategorySelect value={category} onChange={setCategory} />
        </Box>

        <Typography
          sx={{ color: 'primary.main', fontFamily: 'Montserrat', fontWeight: 500, mb: 0.75 }}
        >
          Ingredient
        </Typography>
        <Box sx={{ mb: 2 }}>
          <AddIngredient
            key={`ingredients-${ingredients.length}`}
            initialIngredients={ingredients}
            onChange={setIngredients}
          />
        </Box>

        <Typography
          sx={{ color: 'primary.main', fontFamily: 'Montserrat', fontWeight: 500, mb: 0.75 }}
        >
          Steps
        </Typography>
        <AddStep key={`steps-${steps.length}`} initialSteps={steps} onChange={setSteps} />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        <Button
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
          }}
          onClick={handleSubmit}
        >
          Add Recipe
        </Button>
        <Button
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
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </Box>
    </Container>
  );
};

export default AddRecipePage;
