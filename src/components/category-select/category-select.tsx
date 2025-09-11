import { Autocomplete, TextField, Chip } from '@mui/material';
import { useState } from 'react';

export default function CategoryAutocomplete() {
  const [categories, setCategories] = useState<string[]>([]);

  const options = [
    'Appetizer',
    'Dessert',
    'Main Dish',
    'Side Dish',
    'Soup',
    'Sauce',
    'Drink',
    'Salad',
  ];

  return (
    <Autocomplete
      multiple
      options={options}
      value={categories}
      onChange={(_, newValue) => setCategories(newValue)}
      slotProps={{
        paper: {
          sx: {
            bgcolor: "#f5e2cc",
           
            "& .MuiAutocomplete-option": {
      
              color: "#391F06",
              "&[aria-selected='true']": {
                backgroundColor: "#e6d2b7",
              },
              "&.Mui-focused": {
                backgroundColor: "#f0d9b5",
              },
            },
          },
        },
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={option}
            label={option}
            sx={{
          
              height: 28,
              display: 'flex',
              alignItems: 'center',
            }}
          />
        ))
      }
      renderInput={params => (
        <TextField
          {...params}
          placeholder="Add Category"
          sx={{
            width: '100%',
            paddingBottom: 2,
            '& .MuiInputBase-root': {
              height: 55,
              borderRadius: 2,
              alignItems: 'center',
              justifyContent:'center'
            },
            '& .MuiOutlinedInput-root': {
              height: 55,
              border: '1.5px solid #391F06',
                   justifyContent:'center',
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
      )}
    />
  );
}
