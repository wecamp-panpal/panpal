import { useState } from 'react';
import { Box, TextField, IconButton, Button, FormControl, Select, MenuItem } from '@mui/material';
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
        <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1, rowGap: 0 }}>
          <TextField
            value={ingredient.qty}
            onChange={e => handleChange(i, 'quantity', e.target.value)}
            placeholder='qty'
            sx={{
              width: 100,

              justifyContent: 'center',
              '& .MuiInputBase-root': {
                borderRadius: 2,
              },
              '& .MuiOutlinedInput-root': {
                boxShadow: 'none',
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
                color: '#391F06',

                '&::placeholder': {
                  color: '#BFA980',

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
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                border: '1.5px solid',
                borderColor: 'secondary.main',
                borderRadius: 2,
                color: '#391F06',
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: '#f5e2cc',
                    border: '1px solid',
                    borderColor: 'secondary.main',
                    boxShadow: 3,

                    '& .MuiMenuItem-root': {
                      color: '#391F06',

                      '&:hover': { backgroundColor: '#e6d2b7' },

                      '&.Mui-focusVisible': { backgroundColor: '#f0d9b5' },

                      '&.Mui-selected': {
                        backgroundColor: '#e6d2b7 !important',
                        color: '#391F06',
                      },

                      '&.Mui-selected.Mui-focusVisible': {
                        backgroundColor: '#d8c2a5 !important',
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
                    color: '#391F06',
                    fontSize: 16,
                    background: '#f5e2cc',
                    '&.Mui-selected': {
                      background: '#e6d2b7',
                      color: '#391F06',
                      borderColor: '#391F06',
                    },
                    '&:hover': {
                      background: '#e6d2b7',
                      color: '#391F06',
                    },
                    '&.Mui-focusVisible': {
                      borderColor: '#391F06',
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
            placeholder='Ingredient name...'
            sx={{
              flex: 1,

              justifyContent: 'center',
              '& .MuiInputBase-root': {
                borderRadius: 2,
              },
              '& .MuiOutlinedInput-root': {
                boxShadow: 'none',
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
                color: '#391F06',

                '&::placeholder': {
                  color: '#BFA980',

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
          mt: 0,
          fontSize: 16,
          color: '#391F06',
          textTransform: 'none',
          paddingBottom: 2,
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
