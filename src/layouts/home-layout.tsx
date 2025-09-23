import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import NavBar from '../components/common/nav-bar';
import Footer from '@/components/common/footer';

export default function HomeLayout() {
  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <NavBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: '2.8rem', sm: '3.5rem' }, // Add padding to account for fixed navbar
          pb: { xs: 0, md: 0 },
          backgroundColor: '#f5e2cc',
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
