import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { useAppSelector } from '@/hooks/use-app-selector';
interface ProtectedProps {
  children: React.ReactNode;
  type: 'page' | 'action';
}
import { useEffect } from 'react';

export default function Protected({ children, type = 'action' }: ProtectedProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector(state => state.user);
  // If type=='page', show up popup when component mount
  useEffect(() => {
    if (type === 'page' && !isAuthenticated) {
      setOpen(true);
    }
  }, [type, isAuthenticated]);
  // If type=='action', show up popup when user click on the children component
  const handleClick = (e: React.MouseEvent) => {
    if (type === 'action' && !isAuthenticated) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(true);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSignIn = () => {
    setOpen(false);
    navigate('/sign-in');
  };
  return (
    <div>
      {/*always render children*/}
      {type === 'action' ? (
        <div onClick={handleClick} style={{ width: '100%', height: '100%' }}>
          {children}
        </div>
      ) : (
        <>{children}</>
      )}
      {/*Dialog with 2 button: Close and Sign In*/}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: 'Montserrat', fontWeight: 600 }}>
          Authentication Required
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: 'Montserrat' }}>
            You need to sign in to access this content.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ gap: 1, p: 2 }}>
          <Button onClick={handleClose} sx={{ fontFamily: 'Montserrat' }}>
            Close
          </Button>
          <Button
            onClick={handleSignIn}
            variant="contained"
            autoFocus
            sx={{ fontFamily: 'Montserrat' }}
          >
            Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
