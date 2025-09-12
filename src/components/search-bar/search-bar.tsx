import { InputAdornment, TextField } from '@mui/material';

import { SearchIcon } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

interface SearchBarProps {
  PlaceHolder: string;

  onSearch?: (query: string) => void;
}

const SearchBar = ({ PlaceHolder, onSearch }: SearchBarProps) => {
  const [value, setValue] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const onHandleKey = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && searchRef.current?.value.trim()) {
        const query = searchRef.current.value.trim();
        if (onSearch) {
          onSearch(query);
        }
      }
    },
    [onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (onSearch) {
      onSearch(newValue);
    }
  };

  return (
    <TextField
      inputRef={searchRef}
      value={value}
      onKeyDown={onHandleKey}
      onChange={handleChange}
      variant="outlined"
      placeholder={PlaceHolder}
      sx={{
        width: { xs: '100%', sm: 240, md: 320, lg: 400 },
        '& .MuiInputBase-root': {
          height: { xs: 36, sm: 40, md: 46 },
          borderRadius: '30px',
        },
        '& .MuiOutlinedInput-root': {
          height: { xs: '1.8rem', sm: '2rem', md: '2.2rem' },
          fontWeight: 300,
          fontSize: { xs: 14, sm: 15, md: 16 },

          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#EAC9A3',
          },

          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#EAC9A3',
            borderWidth: 2,
          },

          '&:focus': {
            outline: 'none',
            boxShadow: 'none',
          },
        },
        '& .MuiInputBase-input': {
          fontSize: { xs: 14, sm: 15, md: 16 },
          fontFamily: 'Playfair Display',
          '&::placeholder': {
            color: '#EAC9A3',
            opacity: 1,
            fontSize:15,
            fontFamily: 'Popins',
            letterSpacing: 0.5,
          },
          color: '#EAC9A3',
          '&:focus': {
            outline: 'none',
            boxShadow: 'none',
          },
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#EAC9A3',
        },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="#EAC9A3" />
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default SearchBar;
