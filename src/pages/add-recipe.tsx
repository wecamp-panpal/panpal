import { Box, TextField, Grid, IconButton, Typography, Button } from '@mui/material';
import DescriptionEditor from '@/components/text-editor/text-editor';
import CategorySelect from '@/components/category-select/category-select';
import AddIngredient from '@/components/add-ingredients/add-ingredient';
import {
  CloudUpload as CloudUploadIcon,
  Star as StarIcon,
  AccountCircle as AccountCircleIcon,
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
        fontFamily: 'Playfair Display',
        marginLeft: '2rem',
        paddingTop: '0.1rem',
        marginRight: '2rem',
    
      }}
    >
      <h1 style={{ fontSize: 40, color: '#391F06' }}>Add New Recipe</h1>
      <h3 style={{ fontSize: 20, color: '#391F06' }}>Basic Information</h3>

      <Box>
        <h4 style={{ marginBottom: 10, color: '#391F06' }}>Title</h4>
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
              fontFamily: 'Playfair Display',

              '&::placeholder': {
                color: '#BFA980',
                fontFamily: 'Playfair Display',
                fontSize: 16,
                opacity: 1,
              },
            },
          }}
        />
        <h4 style={{ marginBottom: 10, color: '#391F06' }}>Description</h4>

        <DescriptionEditor />

        <h4 style={{ marginBottom: 10, color: '#391F06' }}> Recipe Picture</h4>

        <Box
          sx={{
            height: 150,
            border: 1,
            borderRadius: 1,
            textAlign: 'center',
            borderColor: '#391F06',
            pt: 2,
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
            <Typography sx={{ fontFamily: 'Playfair Display', color: '#391F06' }}>
              Click to upload or drag and drop
            </Typography>
            <Typography variant="caption" sx={{ fontFamily: 'Playfair Display', color: '#391F06' }}>
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
      <h3 style={{ fontSize: 20, color: '#391F06' }}>Recipe Information</h3>
      <Box>
        <h4 style={{ marginBottom: 10, color: '#391F06' }}>Total Time (minutes)</h4>
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
              fontFamily: 'Playfair Display',

              '&::placeholder': {
                color: '#BFA980',
                fontFamily: 'Playfair Display',
                fontSize: 16,
                opacity: 1,
              },
            },
          }}
        />
        <h4 style={{ marginBottom: 10, color: '#391F06' }}>Category</h4>
        <CategorySelect />
        <h4 style={{ marginBottom: 10, color: '#391F06' }}>Ingredient</h4>
        <AddIngredient />
        <h4 style={{ marginBottom: 10, color: '#391F06' }}>Steps</h4>
        <AddStep />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 2,
          gap: 2
        }}
      >
        <Button
        sx={{
          textTransform:'none',
          background:'#391F06',
          fontFamily:"Playfair Display",
          color:"#F5E2CC",
          width: 100
        }}>Add Recipe</Button>
         <Button sx={{
          textTransform:'none',
          color:'#391F06',
          fontFamily:"Playfair Display",
          background:"#F5E2CC",
          border:1,
          borderColor: '#391F06',
           width: 100
        }}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default AddRecipePage;
