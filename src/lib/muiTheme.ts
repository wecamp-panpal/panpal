import { createTheme } from '@mui/material/styles';

// Function to get CSS variable values from index.css
const getCSSVariable = (variableName: string): string => {
  if (typeof window !== 'undefined') {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
    
    // Debug log to see what we're getting
    console.log(`CSS Variable ${variableName}:`, value);
    
    // Return value if it exists and is not empty
    if (value && value !== '') {
      return value;
    }
  }
  
  // Fallback values từ index.css
  const fallbacks: { [key: string]: string } = {
    '--primary': '#391F06',     // nâu đậm
    '--accent': '#EAC9A3',      // màu be
    '--secondary': '#4B331B',   // nâu phụ
    '--background': '#F5E2CC',  // màu nền
    '--foreground': '#391F06',  // text màu nâu
  };
  
  console.log(`Using fallback for ${variableName}:`, fallbacks[variableName]);
  return fallbacks[variableName] || '';
};

// Create MUI theme based on CSS variables from index.css
export const muiTheme = createTheme({
  palette: {
    primary: {
      main: getCSSVariable('--primary') || '#391F06',
    },
    secondary: {
      main: getCSSVariable('--accent') || '#EAC9A3',
    },
    background: {
      default: getCSSVariable('--background') || '#F5E2CC',
    },
    text: {
      primary: getCSSVariable('--foreground') || '#391F06',
    },
  },
  typography: {
    fontFamily: 'Montserrat, system-ui, Avenir, Helvetica, Arial, sans-serif',
    h1: {
      fontFamily: '"Playfair Display", Georgia, serif',
    },
    h2: {
      fontFamily: '"Playfair Display", Georgia, serif',
    },
    h3: {
      fontFamily: '"Playfair Display", Georgia, serif',
    },
    h4: {
      fontFamily: '"Playfair Display", Georgia, serif',
    },
    h5: {
      fontFamily: '"Playfair Display", Georgia, serif',
    },
    h6: {
      fontFamily: '"Playfair Display", Georgia, serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 0,
        },
      },
    },
  },
});

// Helper to get theme colors for use in sx prop
export const getThemeColors = () => ({
  primary: getCSSVariable('--primary') || '#391F06',
  accent: getCSSVariable('--accent') || '#EAC9A3',
  background: getCSSVariable('--background') || '#F5E2CC',
  foreground: getCSSVariable('--foreground') || '#391F06',
});
