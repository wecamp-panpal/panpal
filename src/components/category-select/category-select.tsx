import { Autocomplete, TextField } from '@mui/material';

export type RecipeCategory =
  | 'APPETIZER'
  | 'DESSERT'
  | 'MAIN_DISH'
  | 'SIDE_DISH'
  | 'SOUP'
  | 'SAUCE'
  | 'DRINK'
  | 'SALAD';

type CategorySelectProps = {
  value: RecipeCategory | null;
  onChange: (value: RecipeCategory | null) => void;
};

const options: RecipeCategory[] = [
  'APPETIZER',
  'DESSERT',
  'MAIN_DISH',
  'SIDE_DISH',
  'SOUP',
  'SAUCE',
  'DRINK',
  'SALAD',
];

export default function CategorySelect({ value, onChange }: CategorySelectProps) {
  return (
    <Autocomplete<RecipeCategory, false, false, false>
      options={options}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      isOptionEqualToValue={(opt, val) => opt === val}
      renderInput={params => (
        <TextField
          {...params}
          placeholder="Select Category"
          sx={{
            width: '100%',
            paddingBottom: 2,
            '& .MuiInputBase-root': {
              height: 55,
              borderRadius: 2,
              alignItems: 'center',
              justifyContent: 'center',
            },
            '& .MuiOutlinedInput-root': {
              height: 55,
              boxShadow: 'none',
              '& fieldset': { borderColor: 'secondary.main' },
              '&:hover fieldset': { borderColor: 'primary.main' },
              '&.Mui-focused fieldset': { borderColor: 'primary.main' },
            },
            '& .MuiInputBase-input': {
              color: '#391F06',
              '&::placeholder': { color: '#BFA980', fontSize: 16, opacity: 1 },
            },
          }}
        />
      )}
      slotProps={{
        paper: {
          sx: {
            bgcolor: '#f5e2cc',
            '& .MuiAutocomplete-option': {
              color: '#391F06',
              "&[aria-selected='true']": { backgroundColor: '#e6d2b7' },
              '&.Mui-focused': { backgroundColor: '#f0d9b5' },
            },
          },
        },
      }}
    />
  );
}
