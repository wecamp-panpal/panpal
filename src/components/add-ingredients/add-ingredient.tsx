import { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

const AddIngredient = () => {
  const [ingredients, setIngredients] = useState([{ qty: '', unit: '', item: '' }]);
  const units = ['g', 'kg', 'ml', 'l', 'tsp', 'cup', 'pcs'];

  const handleChange = (i: number, field: string, value: string) => {
    const updated = [...ingredients];
    (updated[i] as any)[field] = value;
    setIngredients(updated);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { qty: '', unit: '', item: '' }]);
  };

  const removeIngredient = (i: number) => {
    const updated = ingredients.filter((_, index) => index !== i);
    setIngredients(updated.length ? updated : [{ qty: '', unit: '', item: '' }]);
  };

  return (
    <Box>
      {ingredients.map((ingredient, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField
            value={ingredient.qty}
            onChange={e => handleChange(i, 'qty', e.target.value)}
            sx={{
              width: 100,
              paddingBottom: 2,
              justifyContent: 'center',
              '& .MuiInputBase-root': {
                borderRadius: 2,
              },
              '& .MuiOutlinedInput-root': {
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
          <FormControl sx={{ width: 120 }}>
            <Select
              value={ingredient.unit}
              onChange={e => handleChange(i, 'unit', e.target.value)}
               sx={{
      
      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
      border: "1.5px solid #391F06",
      borderRadius: 2,
      color: "#391F06",
      fontFamily: "Playfair Display",
    }}
    MenuProps={{
      PaperProps: {
        sx: {
          bgcolor: "#f5e2cc",
          border: "1px solid #391F06",
          boxShadow: 3,
        
          "& .MuiMenuItem-root": {
            fontFamily: "Playfair Display",
            color: "#391F06",
            
            "&:hover": { backgroundColor: "#e6d2b7" },
        
            "&.Mui-focusVisible": { backgroundColor: "#f0d9b5" },
      
            "&.Mui-selected": {
              backgroundColor: "#e6d2b7 !important",
              color: "#391F06",
            },
     
            "&.Mui-selected.Mui-focusVisible": {
              backgroundColor: "#d8c2a5 !important",
            },
          },
        },
      },
    }}
            >
              {units.map(u => (
                <MenuItem
                  key={u}
                  value={u}
                  sx={{
                    fontFamily: 'Playfair Display',
                    color: '#391F06',
                    fontSize: 16,
                    background: '#f5e2cc',
                    '&.Mui-selected': {
                      background: '#e6d2b7',
                      color: '#391F06',
                       borderColor:'#391F06',

                    },
                    '&:hover': {
                      background: '#e6d2b7',
                      color: '#391F06',
                    },
                    '&.Mui-focusVisible': {
                        borderColor:'#391F06',
                      color: '#391F06',
                    },
                  }}
                >
                  {u}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            value={ingredient.item}
            onChange={e => handleChange(i, 'item', e.target.value)}
            sx={{
              flex: 1,
              paddingBottom: 2,
              justifyContent: 'center',
              '& .MuiInputBase-root': {
                borderRadius: 2,
              },
              '& .MuiOutlinedInput-root': {
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
          <IconButton sx={{ color: '#391F06' }} onClick={() => removeIngredient(i)}>
            <Delete />
          </IconButton>
        </Box>
      ))}
      <Button
        sx={{
          fontFamily: 'Playfair Display',
          fontSize: 16,
          color: '#391F06',
          textTransform: 'none',
          '&:hover': {
            background: '#e6d2b7',
            color: '#391F06',
          },
        }}
        startIcon={<Add sx={{ color: '#391F06', '&:hover': { color: '#fff' } }} />}
        onClick={addIngredient}
      >
        Add ingredient
      </Button>
    </Box>
  );
};

export default AddIngredient;
