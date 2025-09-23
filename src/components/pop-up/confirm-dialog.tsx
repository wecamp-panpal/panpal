import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle 
        sx={{ 
          fontFamily: 'Playfair Display, serif', 
          fontWeight: 700,
          color: 'primary.main',
          fontSize: '24px'
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText 
          sx={{ 
            fontFamily: 'Montserrat, sans-serif',
            color: 'primary.main',
            fontSize: '16px',
            opacity: 0.8
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ gap: 1, p: 2 }}>
        <Button 
          onClick={onCancel} 
          sx={{ 
            fontFamily: 'Montserrat, sans-serif',
            color: 'primary.main',
            backgroundColor: 'secondary.main',
            border: '2px solid',
            borderColor: 'primary.main',
            px: 3,
            py: 1,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#e6d2b7',
            }
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          autoFocus
         sx={{ 
            fontFamily: 'Montserrat, sans-serif',
            backgroundColor: 'primary.main',
            color: 'secondary.main',
            px: 3,
            py: 1,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#2a1604',
            }
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}