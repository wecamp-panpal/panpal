import { getThemeColors } from '@/lib/muiTheme';
import { getCurrentUser } from "@/services/auth";
import { Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  isAuthenticated: boolean;
}

const Hero = ({ isAuthenticated }: HeroProps) => {
  const colors = getThemeColors();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");

 
useEffect(() => {
  const fetchUser = async () => {
    const user = await getCurrentUser();
    if (user) {
     
      setUsername(user.name); 
    }
  };
  fetchUser();
}, []);
  return (
    <section className="w-full pt-20 pb-28 px-8 relative">
      <div className="max-w-7xl mx-auto py-3">
        <div className="flex items-center justify-start relative">
          {isAuthenticated ? (
            <>
              <div className="max-w-2xl relative z-30 text-center lg:text-left w-full lg:w-auto pt-15">
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
                  {username}
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
                    onClick={() => navigate('/explore')}
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
                      '&:focus': {
                        outline: 'none',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    Explore Recipe
                  </Button>

                  <Button
                    onClick={() => navigate('/add-recipe')}
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
                      '&:focus': {
                        outline: 'none',
                        boxShadow: 'none',
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
                  src="/assets/vegetables.png"
                  alt="Vegetables"
                  className="absolute -bottom-12 -right-64 w-[1052px] h-auto z-10"
                />

        
                <img
                  src="/assets/bread.png"
                  alt="Bread"
                  className="absolute -bottom-32 -right-64 w-[815px] h-auto z-20"
                />
              </div>
            </>
          ) : (
            <>
              <div className="max-w-2xl relative z-30 text-center lg:text-left w-full lg:w-auto pt-1">
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
                    onClick={() => navigate('/explore')}
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
                      '&:focus': {
                        outline: 'none',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    Explore Recipe
                  </Button>

                  <Button
                    onClick={() => navigate('/add-recipe')} 
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
                      '&:focus': {
                        outline: 'none',
                        boxShadow: 'none',
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
                  src="/assets/vegetables.png"
                  alt="Vegetables"
                  className="absolute -bottom-12 -right-64 w-[1052px] h-auto z-10"
                />
                <img
                  src="/assets/bread.png"
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
