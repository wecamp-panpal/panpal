import { Typography, Box, Button } from "@mui/material";
import { getThemeColors } from "@/lib/muiTheme";

const FeaturedSection = () => {
  const colors = getThemeColors();

  return (
    <section className="w-full">
      <Box
        sx={{
          backgroundColor: colors.accent, // Màu be
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          padding: '80px 4%',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          minHeight: '700px',
          paddingTop: '60px',
          paddingBottom: '40px'
        }}
      >
        <div className="relative">
          <img 
            src="/src/assets/pancake.png"
            alt="Pancake"
            style={{
              width: '850px',
              height: '650px',
              objectFit: 'cover',
              borderRadius: '24px'
            }}
          />
          
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              right: '-500px',
              transform: 'translateY(-50%)',
              textAlign: 'left',
              maxWidth: '600px'
            }}
          >
            <Typography 
              variant="h2"
              sx={{
                fontSize: '70px',
                fontWeight: 400,
                color: colors.primary,
                marginBottom: '32px',
                lineHeight: 1.2
              }}
            >
              Ready to share your first recipe?
            </Typography>
            
            <Button
              variant="contained"
              sx={{
                backgroundColor: colors.primary,
                color: '#FFFFFF',
                borderRadius: 0,
                fontWeight: 500,
                fontFamily: 'Montserrat',
                textTransform: 'none',
                padding: '16px 32px',
                fontSize: '18px',
                '&:hover': {
                  backgroundColor: colors.primary,
                  opacity: 0.9,
                },
                '&:focus': {
                  outline: 'none',
                  boxShadow: 'none',
                },
              }}
            >
              Register Now
            </Button>
          </Box>
        </div>
      </Box>
    </section>
  );
};

export default FeaturedSection;
