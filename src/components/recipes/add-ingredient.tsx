import { useState, useEffect, useCallback } from 'react';
import { Box, TextField, IconButton, Button, FormControl, Select, MenuItem } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

interface AddIngredientProps {
  initialIngredients?: { name: string; quantity: string }[];
  onChange?: (ingredients: { name: string; quantity: string }[]) => void;
}

const AddIngredient = ({ initialIngredients, onChange }: AddIngredientProps) => {
  const [ingredients, setIngredients] = useState(() => {
    if (initialIngredients && initialIngredients.length > 0) {
      return initialIngredients.map(ing => {
        const parts = ing.quantity.split(' ');
        const qty = parts[0] || '';
        const unit = parts.slice(1).join(' ') || '';
        return { qty, unit, item: ing.name };
      });
    }
    return [{ qty: '', unit: '', item: '' }];
  });

  const units = ['g', 'kg', 'ml', 'l', 'tsp', 'cup', 'pcs'];

  const notifyParent = useCallback(
    (newIngredients: typeof ingredients) => {
      const formatted = newIngredients
        .filter(ing => ing.item.trim())
        .map(ing => ({
          name: ing.item,
          quantity: `${ing.qty} ${ing.unit}`.trim(),
        }));
      onChange?.(formatted);
    },
    [onChange]
  );

  useEffect(() => {
    notifyParent(ingredients);
  }, [ingredients, notifyParent]);

  const handleChange = (i: number, field: string, value: string) => {
    const updated = [...ingredients];
    (updated[i] as any)[field] = value;
    setIngredients(updated);
  };

  const addIngredient = () => {
    setIngredients(prev => [...prev, { qty: '', unit: '', item: '' }]);
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
            onChange={e => handleChange(i, 'qty', e.target.value)}
            placeholder="qty"
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
            placeholder="Ingredient name..."
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
          border: 'none',
          boxShadow: 'none',
          '&:hover': {
            background: '#e6d2b7',
            color: '#391F06',
            border: 'none',
            boxShadow: 'none',
          },
          '&:focus': {
            border: 'none',
            boxShadow: 'none',
            outline: 'none',
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
