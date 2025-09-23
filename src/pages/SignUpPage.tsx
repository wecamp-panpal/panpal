import React, { useState, useRef, useLayoutEffect } from 'react';
import { Box } from '@mui/material';
import SignUpForm from '@/components/signUp-form/signUp-form';
import NavBar from '../components/nav-bar/nav-bar';

const SignUpPage: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <NavBar />
      <Box display="flex" flexDirection="row">
        <Box
          flex={1}
          display="flex"
          justifyContent="left"
          alignItems="center"
          padding={'2rem'}
          color={'#FDF2E5'}
          sx={{ mt: { xs: 6, sm: 0 } }}
        >
          <SignUpForm />
        </Box>
        <Box
          flex={1}
          display="flex"
          justifyContent="left"
          alignItems="left"
          style={{
            overflow: 'hidden',
          }}
        >
          <img
            src="/signup_img.svg"
            alt="Panpal Logo"
            style={{
              width: 'calc(100% + 4rem)', // tăng width để bù phần bị cắt
              height: 'auto',
              marginLeft: '-8rem', // cắt 8rem bên trái
              display: 'block',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SignUpPage;
