import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import NavBar from '../components/nav-bar/nav-bar';
import Footer from '@/components/footer/footer';

export default function HomeLayout() {
  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <NavBar />
      <Box component="main" sx={{
          flexGrow: 1,
          mt: '3.5rem',
          pb: { xs: 4, md: 6 },          
          backgroundColor: '#f5e2cc',    
        }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}

