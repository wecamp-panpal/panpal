import { Box, Typography, Button, Container } from '@mui/material';
import { Home, ArrowBack, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getThemeColors } from '@/lib/muiTheme';

export default function NotFound() {
  const navigate = useNavigate();
  const colors = getThemeColors();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 4,
        }}
      >
        {/* Animated 404 Number */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '6rem', sm: '8rem', md: '10rem' },
              fontWeight: 'bold',
              color: colors.primary,
              lineHeight: 0.8,
              mb: 2,
              fontFamily: '"Playfair Display", Georgia, serif',
              textShadow: `2px 2px 4px rgba(0,0,0,0.1)`,
            }}
          >
            404
          </Typography>
        </motion.div>

        {/* Pan/Chef Hat Icon Animation */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              width: { xs: 120, sm: 150 },
              height: { xs: 120, sm: 150 },
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.accent,
              borderRadius: '50%',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            }}
          >
            {/* Chef hat or pan icon using CSS */}
            <Box
              sx={{
                width: '60%',
                height: '60%',
                backgroundColor: colors.primary,
                borderRadius: '50%',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 20,
                  height: 20,
                  backgroundColor: colors.primary,
                  borderRadius: '50%',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80%',
                  height: 4,
                  backgroundColor: colors.background,
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        </motion.div>

        {/* Error Messages */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h4"
            sx={{
              color: colors.primary,
              mb: 2,
              fontWeight: 600,
              fontFamily: '"Playfair Display", Georgia, serif',
            }}
          >
            Oops! Recipe Not Found
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              color: colors.primary,
              mb: 4,
              opacity: 0.8,
              maxWidth: 500,
              lineHeight: 1.6,
              fontSize: '1.1rem',
            }}
          >
            Looks like this recipe has been moved to another kitchen! 
            Don't worry, there are plenty of delicious recipes waiting for you.
          </Typography>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
            }}
          >
            <Button
              variant="contained"
              startIcon={<Home />}
              onClick={() => navigate('/')}
              sx={{
                backgroundColor: colors.primary,
                color: colors.background,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                minWidth: { xs: '200px', sm: 'auto' },
                '&:hover': {
                  backgroundColor: colors.accent,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Back to Home
            </Button>

            <Button
              variant="outlined"
              startIcon={<Search />}
              onClick={() => navigate('/explore')}
              sx={{
                color: colors.primary,
                borderColor: colors.primary,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                minWidth: { xs: '200px', sm: 'auto' },
                '&:hover': {
                  backgroundColor: colors.primary,
                  color: colors.background,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Explore Recipes
            </Button>

            <Button
              variant="text"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{
                color: colors.primary,
                px: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 500,
                textTransform: 'none',
                minWidth: { xs: '200px', sm: 'auto' },
                '&:hover': {
                  backgroundColor: 'rgba(57, 31, 6, 0.05)',
                },
              }}
            >
              Go Back
            </Button>
          </Box>
        </motion.div>

        {/* Floating Animation Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: 40,
            height: 40,
            opacity: 0.1,
          }}
        >
          <motion.div
            animate={{ 
              y: [-10, 10, -10],
              rotate: [0, 360, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundColor: colors.accent,
                borderRadius: '50%',
              }}
            />
          </motion.div>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            right: '15%',
            width: 30,
            height: 30,
            opacity: 0.1,
          }}
        >
          <motion.div
            animate={{ 
              y: [10, -10, 10],
              rotate: [0, -360, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundColor: colors.primary,
                borderRadius: '20%',
              }}
            />
          </motion.div>
        </Box>
      </Box>
    </Container>
  );
}
