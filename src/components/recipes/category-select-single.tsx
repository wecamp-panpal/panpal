import { FormControl, Select, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import type { UIRecipeCategory } from '@/types/ui-recipe';

interface CategorySelectSingleProps {
  initialValue?: UIRecipeCategory;
  onChange?: (value: UIRecipeCategory) => void;
}

export default function CategorySelectSingle({ initialValue, onChange }: CategorySelectSingleProps) {
  const [category, setCategory] = useState<UIRecipeCategory>(initialValue || 'MAIN_DISH');

  const options: UIRecipeCategory[] = [
    'DESSERT',
    'DRINK', 
    'MAIN_DISH'
  ];

  // Display names for UI
  const displayNames: Record<UIRecipeCategory, string> = {
    'APPETIZER': 'Appetizer',
    'DESSERT': 'Dessert', 
    'MAIN_DISH': 'Main Dish',
    'SIDE_DISH': 'Side Dish',
    'SOUP': 'Soup',
    'SAUCE': 'Sauce', 
    'DRINK': 'Drink',
    'SALAD': 'Salad'
  };

  useEffect(() => {
    if (initialValue) {
      setCategory(initialValue);
    }
  }, [initialValue]);

  const handleChange = (value: UIRecipeCategory) => {
    setCategory(value);
    onChange?.(value);
  };

  return (
    <FormControl sx={{ width: '100%' }}>
      <Select
        value={category}
        onChange={e => handleChange(e.target.value as UIRecipeCategory)}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
          border: '1.5px solid',
          borderColor: 'secondary.main',
          borderRadius: 2,
          color: '#391F06',
          height: 40,
          '&:hover': {
            borderColor: 'primary.main',
          },
          '&.Mui-focused': {
            borderColor: 'primary.main',
          },
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
        {options.map(option => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              color: '#391F06',
              fontSize: 16,
              background: '#f5e2cc',
              '&.Mui-selected': {
                background: '#e6d2b7',
                color: '#391F06',
              },
              '&:hover': {
                background: '#e6d2b7',
                color: '#391F06',
              },
            }}
          >
            {displayNames[option] || option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
