import { useState } from 'react';
import { Box, Container, Typography, TextField, Button } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

import DescriptionEditor from '@/components/text-editor/text-editor';
import CategorySelect from '@/components/category-select/category-select';
import AddIngredient from '@/components/add-ingredients/add-ingredient';
import AddStep from '@/components/add-step/add-step';

const AddRecipePage = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [totalMinutes, setTotalMinutes] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const newFile = event.target.files[0];
    setImagePreview(URL.createObjectURL(newFile));
    event.target.value = '';
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
        />

        <Typography
          sx={{ color: 'primary.main', fontFamily: 'Montserrat', fontWeight: 500, mb: 0.75 }}
        >
          Description
        </Typography>
        <Box sx={{ mb: 3 }}>
          <DescriptionEditor />
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

      <Box >
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
          <CategorySelect />
        </Box>

        <Typography
          sx={{ color: 'primary.main', fontFamily: 'Montserrat', fontWeight: 500, mb: 0.75 }}
        >
          Ingredient
        </Typography>
        <Box sx={{ mb: 2 }}>
          <AddIngredient />
        </Box>

        <Typography
          sx={{ color: 'primary.main', fontFamily: 'Montserrat', fontWeight: 500, mb: 0.75 }}
        >
          Steps
        </Typography>
        <AddStep />
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
                    color: 'primary.main'
                  },
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none' }
          }}
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
    </Container>
  );
};

export default AddRecipePage;
