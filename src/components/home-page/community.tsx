import { useState } from "react";
import { Typography, Avatar, Box } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { getThemeColors } from "@/lib/muiTheme";

const Community = () => {
  const colors = getThemeColors();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage || isAnimating) return;
    
    setIsAnimating(true);
    
    // Fade out
    setTimeout(() => {
      setCurrentPage(newPage);
      // Fade in
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 500);
  };
  
  const testimonials = [
    {
      id: 1,
      quote: "This community turned my simple weeknight ramen into a family favorite for hundreds.",
      name: "Jocelyn, Korea",
      date: "22 Jul 2025",
      avatar: "/api/placeholder/48/48",
      image: "/src/assets/ramen.jpg"
    },
    {
      id: 2,
      quote: "From basic pasta to gourmet masterpiece - this community taught me everything I needed to know.",
      name: "Marco, Italy",
      date: "18 Jul 2025", 
      avatar: "/api/placeholder/48/48",
      image: "/src/assets/ramen.jpg"
    },
    {
      id: 3,
      quote: "The recipes here helped me bring authentic flavors from around the world to my kitchen.",
      name: "Sakura, Japan",
      date: "15 Jul 2025",
      avatar: "/api/placeholder/48/48", 
      image: "/src/assets/ramen.jpg"
    }
  ];
  
  const currentTestimonial = testimonials.find(t => t.id === currentPage) || testimonials[0];

  return (
    <section className="w-full pt-16 pb-32 px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-start relative gap-8">
          <div className="max-w-2xl relative text-center lg:text-left w-full lg:w-auto flex flex-col min-h-[540px]">
            <Typography 
              variant="h2" 
              sx={{ 
                marginBottom: '24px',
                fontSize: '52px',
                fontWeight: 500
              }}
            >
              Our Community
            </Typography>
            
            <Box
              sx={{
                opacity: isAnimating ? 0 : 1,
                transition: 'opacity 0.5s ease-in-out'
              }}
            >
              <Typography 
                variant="h3"
                style={{ 
                  color: colors.primary,
                  fontSize: '44px',
                  fontWeight: 400,
                  marginTop: '80px',
                  maxWidth: '700px'
                }}
              >
                "{currentTestimonial.quote}"
              </Typography>
              
              {/* User info */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  marginTop: '24px' 
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 48, 
                    height: 48 
                  }}
                  src={currentTestimonial.avatar}
                  alt={currentTestimonial.name}
                />
                <Typography 
                  sx={{ 
                    fontFamily: 'Montserrat, system-ui, Avenir, Helvetica, Arial, sans-serif',
                    fontSize: '22px',
                    fontWeight: 500,
                    color: colors.primary 
                  }}
                >
                  {currentTestimonial.name} • {currentTestimonial.date}
                </Typography>
              </Box>
            </Box>
            
            {/* Pagination */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                marginTop: 'auto',
                paddingTop: '40px'
              }}
            >
              {[1, 2, 3].map((pageNumber) => (
                <Typography 
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  sx={{ 
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontSize: '24px',
                    fontWeight: 400,
                    color: colors.primary,
                    opacity: currentPage === pageNumber ? 1 : 0.5,
                    cursor: 'pointer',
                    transition: 'opacity 0.3s ease',
                    '&:hover': {
                      opacity: 1
                    }
                  }}
                >
                  {pageNumber}
                </Typography>
              ))}
              <Box 
                onClick={() => handlePageChange(currentPage === 3 ? 1 : currentPage + 1)}
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '16px',
                  cursor: 'pointer',
                  transition: 'opacity 0.3s ease',
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
              >
                <Box 
                  sx={{ 
                    width: '120px', 
                    height: '2.4px', 
                    backgroundColor: colors.primary
                  }} 
                />
                <ArrowForward 
                  sx={{ 
                    color: colors.primary,
                    fontSize: '22px',
                    marginTop: '0.8px',
                    marginLeft: '-16px'
                  }} 
                />
              </Box>
            </Box>
          </div>
          
          {/* Khung ảnh ramen */}
          <div className="hidden lg:block flex-shrink-0" style={{ alignSelf: 'flex-start', marginTop: '140px' }}>
            <img 
              src={currentTestimonial.image}
              alt={`${currentTestimonial.name} dish`}
              style={{
                width: '600px',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '16px',
                opacity: isAnimating ? 0 : 1,
                transition: 'opacity 0.5s ease-in-out'
              }}
            />
          </div>
          
          <div 
            className="absolute hidden lg:block"
            style={{
              height: '3px',
              backgroundColor: colors.primary,
              left: '410px', 
              width: '100vw',
              top: '40px',
              zIndex: 10
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Community;
