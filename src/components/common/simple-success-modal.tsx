import { Dialog, DialogContent, Typography, Box, Button } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { getThemeColors } from '../../lib/muiTheme';

interface SimpleSuccessModalProps {
  open: boolean;
  onClose: () => void;
  onButtonClick?: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
}

const SimpleSuccessModal = ({ 
  open, 
  onClose,
  onButtonClick,
  title = "Success!", 
  message = "Operation completed successfully",
  buttonText = "Continue"
}: SimpleSuccessModalProps) => {
  const themeColors = getThemeColors();

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundColor: themeColors.background,
          border: `2px solid ${themeColors.accent}`,
          minWidth: '320px',
          maxWidth: '400px',
        }
      }}
    >
      <DialogContent sx={{ textAlign: 'center', py: 3, px: 2.5, backgroundColor: themeColors.background }}>

        <Box sx={{ mb: 2.5 }}>
          <CheckCircle sx={{ fontSize: 56, color: themeColors.primary }} />
        </Box>

        <Typography 
          variant="h5" 
          sx={{ 
            fontFamily: 'Playfair Display, serif', 
            fontWeight: 700, 
            color: themeColors.primary,
            mb: 1.5 
          }}
        >
          {title}
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ 
            fontFamily: 'Montserrat', 
            color: themeColors.foreground,
            mb: 3,
            fontSize: '1rem',
            opacity: 0.8,
            maxWidth: '280px',
            mx: 'auto'
          }}
        >
          {message}
        </Typography>

        <Button
          onClick={onButtonClick || onClose}
          variant="contained"
          sx={{
            backgroundColor: themeColors.primary,
            color: themeColors.background,
            px: 3.5,
            py: 1.2,
            borderRadius: 3,
            fontFamily: 'Montserrat',
            fontWeight: 600,
            fontSize: '0.95rem',
            textTransform: 'none',
            boxShadow: `0 4px 12px ${themeColors.primary}4D`,
            '&:hover': {
              backgroundColor: themeColors.accent,
              color: themeColors.primary,
              boxShadow: `0 6px 16px ${themeColors.primary}66`,
              transform: 'translateY(-2px)',
            },
            '&:focus': {
              outline: 'none',
              boxShadow: `0 4px 12px ${themeColors.primary}4D`
            },
            transition: 'all 0.2s ease'
          }}
        >
          {buttonText}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleSuccessModal;
