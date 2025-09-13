import { getThemeColors } from '@/lib/muiTheme';
import { Button, Typography } from '@mui/material';
import { useState } from 'react';

const Hero = () => {
  const colors = getThemeColors();
  const [isAuthenticate, setAuthenticate] = useState(false);

  return (
    <section className="w-full py-24 px-8 relative">
      <div className="max-w-7xl mx-auto py-5">
        <div className="flex items-center justify-start relative">
          {isAuthenticate ? (
            <>
              <div className="max-w-2xl relative z-30 text-center lg:text-left w-full lg:w-auto">
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: '70px',
                    fontWeight: 400,
                    lineHeight: 'normal',
                  }}
                >
                  Recipes from culinary enthusiasts all over the world!
                </Typography>
                <Typography
                  sx={{
                    fontSize: '26px',
                    fontWeight: 400,
                    lineHeight: 'normal',
                    marginTop: '24px',
                  }}
                >
                  From your kitchen to the world's table.
                </Typography>

                <div className="flex items-center justify-center lg:justify-start gap-4 mt-8">
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: colors.primary,
                      color: '#FFFFFF',
                      borderRadius: 0,
                      fontWeight: 500,
                      fontFamily: 'Montserrat',
                      textTransform: 'none',
                      padding: '12px 24px',
                      fontSize: '16px',
                      '&:hover': {
                        backgroundColor: colors.primary,
                        opacity: 0.9,
                      },
                    }}
                  >
                    Explore Recipe
                  </Button>

                  <Button
                    variant="outlined"
                    sx={{
                      backgroundColor: 'transparent',
                      color: colors.primary,
                      border: `2px solid ${colors.primary}`,
                      borderRadius: 0,
                      fontWeight: 500,
                      fontFamily: 'Montserrat',
                      textTransform: 'none',
                      padding: '10px 24px',
                      fontSize: '16px',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        border: `2px solid ${colors.primary}`,
                        opacity: 0.8,
                      },
                    }}
                  >
                    Add Your Own
                  </Button>
                </div>
              </div>

              {/* Hình ảnh ở layer dưới - chỉ hiện trên desktop */}
              <div className="hidden lg:block absolute top-0 right-0 w-full h-full pointer-events-none">
                {/* Vegetables - bự hơn và ở góc trên phải */}
                <img
                  src="/src/assets/vegetables.png"
                  alt="Vegetables"
                  className="absolute -bottom-12 -right-64 w-[1052px] h-auto z-10"
                />

                {/* Bread - bự hơn và ở góc dưới phải */}
                <img
                  src="/src/assets/bread.png"
                  alt="Bread"
                  className="absolute -bottom-32 -right-64 w-[815px] h-auto z-20"
                />
              </div>
            </>
          ) : (
            <>
              <div className="max-w-2xl relative z-30 text-center lg:text-left w-full lg:w-auto">
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: '70px',
                    fontWeight: 400,
                    lineHeight: 'normal',
                  }}
                >
                  Welcome Back,
                </Typography>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: '70px',
                    fontWeight: 400,
                    lineHeight: 'normal',
                  }}
                >
                  User
                </Typography>

                <Typography
                  sx={{
                    fontSize: '26px',
                    fontWeight: 400,
                    lineHeight: 'normal',
                    marginTop: '24px',
                  }}
                >
                  From your kitchen to the world's table.
                </Typography>
                <div className="flex items-center justify-center lg:justify-start gap-4 mt-8">
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: colors.primary,
                      color: '#FFFFFF',
                      borderRadius: 0,
                      fontWeight: 500,
                      fontFamily: 'Montserrat',
                      textTransform: 'none',
                      padding: '12px 24px',
                      fontSize: '16px',
                      '&:hover': {
                        backgroundColor: colors.primary,
                        opacity: 0.9,
                      },
                    }}
                  >
                    Explore Recipe
                  </Button>

                  <Button
                    variant="outlined"
                    sx={{
                      backgroundColor: 'transparent',
                      color: colors.primary,
                      border: `2px solid ${colors.primary}`,
                      borderRadius: 0,
                      fontWeight: 500,
                      fontFamily: 'Montserrat',
                      textTransform: 'none',
                      padding: '10px 24px',
                      fontSize: '16px',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        border: `2px solid ${colors.primary}`,
                        opacity: 0.8,
                      },
                    }}
                  >
                    Add Your Own
                  </Button>
                </div>
              </div>
              {/* Hình ảnh ở layer dưới - chỉ hiện trên desktop */}
              <div className="hidden lg:block absolute top-0 right-0 w-full h-full pointer-events-none">
                {/* Vegetables - bự hơn và ở góc trên phải */}
                <img
                  src="/src/assets/vegetables.png"
                  alt="Vegetables"
                  className="absolute -bottom-12 -right-64 w-[1052px] h-auto z-10"
                />

                {/* Bread - bự hơn và ở góc dưới phải */}
                <img
                  src="/src/assets/bread.png"
                  alt="Bread"
                  className="absolute -bottom-32 -right-64 w-[815px] h-auto z-20"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
