import { Box, TextField, Grid, IconButton, Typography } from '@mui/material';
import DescriptionEditor from '@/components/text-editor/text-editor';

import {
  CloudUpload as CloudUploadIcon,
  Star as StarIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import { useState } from 'react';


const AddRecipePage = () => {
     const [imagePreviews, setImagePreviews] = useState<string[]>([]);
       const [files, setFiles] = useState<File[]>([]);

      const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      const previews = newFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previews]);
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
          <h4 style={{ marginBottom: 10 }}>Title</h4>
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
          <h4 style={{ marginBottom: 10 }}>Description</h4>

          <DescriptionEditor />

           <h4 style={{ marginBottom: 10 }}> Recipe Picture</h4>
           
           <Box
        sx={{
         height:150,
          border: 1,
          borderRadius: 1,
          textAlign: "center",
         borderColor: '#391F06',
         pt: 2
        }}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <IconButton component="span">
            <CloudUploadIcon fontSize="large" />
          </IconButton>
          <Typography>Click to upload or drag and drop</Typography>
          <Typography variant="caption">JPG, PNG, or GIF (max. 5MB)</Typography>
        </label>
      </Box>
      {imagePreviews.length > 0 && (
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {imagePreviews.map((src, index) => (
            <img
              src={src}
              alt={`preview ${index}`}
              style={{
                width: "100%",
                borderRadius: 8,
              }}
            />
          ))}
        </Grid>
      )}

        </Box>
        <h3 style={{ fontSize: 20, color: '#391F06' }}>Recipe Information</h3>
       
      </Box>
 
  );
};

export default AddRecipePage;
