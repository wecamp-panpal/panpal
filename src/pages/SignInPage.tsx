import { Box, Typography } from '@mui/material';

import SignInForm from '@/components/signIn-form/signIn-form';
import NavBar from '../components/nav-bar/nav-bar';

const SignInPage: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <NavBar />
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} padding={'1rem'}>
        <Box
          flex={1}
          display={{ xs: 'none', sm: 'flex' }}
          justifyContent="right"
          alignItems="center"
          flexDirection="column"
          sx={{ overflow: 'hidden' }}
        >
          <img
            src="/signin_img.svg"
            alt="Panpal Logo"
            style={{
              width: 'calc(100% + 3.125rem)',
              height: 'auto',
              marginRight: '-9.375rem',
              marginTop: '-1.25rem',
              marginBottom: '-1.25rem',
            }}
          />
          <Typography
            variant="h4"
            fontWeight={600}
            color="#333"
            textAlign="left"
            sx={{
              marginTop: '-6rem',
              marginRight: '12rem',
              lineHeight: 1.2,
              fontSize: '1.75rem',
            }}
          >
            Let's get cooking
            <br />
            Share your recipes with the world!
          </Typography>
        </Box>
        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          color={'#FDF2E5'}
          sx={{
            mt: { xs: 6, sm: 0 }, 
          }}
        >
          <SignInForm />
        </Box>
      </Box>
    </Box>
  );
};

export default SignInPage;
