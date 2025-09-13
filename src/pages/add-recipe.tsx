import { Box, TextField, Grid, IconButton, Typography, Button } from '@mui/material';
import DescriptionEditor from '@/components/text-editor/text-editor';
import CategorySelect from '@/components/category-select/category-select';
import AddIngredient from '@/components/add-ingredients/add-ingredient';
import {
  CloudUpload as CloudUploadIcon,
 
} from '@mui/icons-material';
import { useState } from 'react';
import AddStep from '@/components/add-step/add-step';

const AddRecipePage = () => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
 

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      const previews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...previews]);
    }
  };
  return (
    <Box
      sx={{
        marginLeft: '3rem',
        paddingTop: '2rem',
        marginRight: '3rem',
        gap: 2,
      }}
    >
      <h1 style={{ fontSize: 40, color: '#391F06', marginBottom: '1rem', fontWeight: "medium" }}>Add New Recipe</h1>
      <Typography sx={{ fontSize: 25, color: '#391F06', marginBottom: '0.5rem', fontWeight: "medium", fontFamily:"Montserrat" }}>Basic Information</Typography>

      <Box>
        <Typography sx={{  color: '#391F06', fontFamily:"Montserrat" , fontWeight: "medium" }}>Title</Typography>
        <TextField
          placeholder="Input your recipe name..."
          sx={{
            width: '100%',
            paddingBottom: 2,
            justifyContent: 'center',
            '& .MuiInputBase-root': {
              height: 35,
              borderRadius: 2,
            },
            '& .MuiOutlinedInput-root': {
              height: 35,
              border: '1.5px solid #391F06',
              boxShadow: 'none',
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent',
              },
            },
            '& .MuiInputBase-input': {
              color: '#391F06',

              '&::placeholder': {
                color: '#BFA980',

                fontSize: 16,
                opacity: 1,
              },
            },
          }}
        />
        <Typography sx={{ color: '#391F06', fontFamily:"Montserrat", fontWeight:"medium"}}>Description</Typography>
        <Box sx={{ mb: 3 }}>
          <DescriptionEditor />
        </Box>

        <Typography sx={{ color: '#391F06' , fontFamily:"Montserrat", fontWeight:"medium"}}> Recipe Picture</Typography>
        <Box
          sx={{
            height: 150,
            border: 1,
            borderRadius: 1,
            textAlign: 'center',
            borderColor: '#391F06',
            pt: 2,
            mb: 3,
          }}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <IconButton component="span">
              <CloudUploadIcon fontSize="large" sx={{ color: '#391F06' }} />
            </IconButton>
            <Typography sx={{ color: '#391F06' }}>Click to upload or drag and drop</Typography>
            <Typography variant="caption" sx={{ color: '#391F06' }}>
              JPG, PNG, or GIF (max. 5MB)
            </Typography>
          </label>
        </Box>
        {imagePreviews.length > 0 && (
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {imagePreviews.map((src, index) => (
              <img
                src={src}
                alt={`preview ${index}`}
                style={{
                  width: '100%',
                  borderRadius: 8,
                }}
              />
            ))}
          </Grid>
        )}
      </Box>
      <Typography sx={{ fontSize: 25, color: '#391F06', marginBottom: '0.5rem', fontWeight:"medium", fontFamily:"Montserrat"}}>Recipe Information</Typography>
      <Box>
        <Typography sx={{  color: '#391F06', fontFamily:"Montserrat", fontWeight:"medium" }}>Total Time (minutes)</Typography>
        <TextField
          type="number"
          value={totalMinutes}
          onChange={e => setTotalMinutes(Number(e.target.value))}
          sx={{
            width: '100%',
            paddingBottom: 2,
            justifyContent: 'center',
            '& .MuiInputBase-root': {
              height: 35,
              borderRadius: 2,
            },
            '& .MuiOutlinedInput-root': {
              height: 35,
              border: '1.5px solid #391F06',
              boxShadow: 'none',
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent',
              },
            },
            '& .MuiInputBase-input': {
              color: '#391F06',

              '&::placeholder': {
                color: '#BFA980',

                fontSize: 16,
                opacity: 1,
              },
            },
          }}
        />
        <Typography sx={{  color: '#391F06' , fontFamily:"Montserrat", fontWeight:"medium"}}>Category</Typography>
        <CategorySelect />
        <Typography sx={{  color: '#391F06', fontFamily:"Montserrat", fontWeight:"medium" }}>Ingredient</Typography>
        <AddIngredient />
        <Typography sx={{  color: '#391F06' , fontFamily:"Montserrat", fontWeight:"medium"}}>Steps</Typography>
        <AddStep />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 4,
          gap: 2,
        }}
      >
        <Button
          sx={{
            textTransform: 'none',
            background: '#391F06',
            color: '#F5E2CC',
            width: 100,
          }}
        >
          Add Recipe
        </Button>
        <Button
          sx={{
            textTransform: 'none',
            color: '#391F06',
            background: '#F5E2CC',
            border: 1,
            borderColor: '#391F06',
            width: 100,
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default AddRecipePage;
