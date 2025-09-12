import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Rating,
  CardMedia,
} from '@mui/material';

interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  cookTime?: string;
  cooking_time?: string;
  difficulty: string;
  rating: number;
  category: string;
  author_name?: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  type?: 'my-recipe' | 'favorite';
  variant?: 'default' | 'public';
  onEdit?: () => void;
  onView?: () => void;
  onClick?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, type = 'my-recipe', variant = 'default', onEdit, onView, onClick }) => {
  const isPublic = variant === 'public';
  const username = type === 'my-recipe' ? '@johndoe' : '@chef_master';

  const card = (
    <Card
      className='recipe-card'
      sx={{
        mx: 'auto',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(57, 31, 6, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        ...(isPublic && {
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 12px 30px rgba(57, 31, 6, 0.15)',
          },
        }),
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="280"
          image={recipe.image}
          alt={recipe.title}
          sx={{
            objectFit: 'cover',
            width: '100%',
            aspectRatio: '1/1'
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3, pb: 2 }}>
        <Typography
          variant="h6" 
          sx={{
            mb: 0.5,
            color: '#2D1810',
            fontWeight: 600,
            fontSize: '1.1rem',
            fontFamily: '"Playfair Display", serif',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {recipe.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
          <Rating
            value={recipe.rating}
            precision={0.1}
            size="small" 
            readOnly
            sx={{
              '& .MuiRating-iconFilled': {
                color: '#D4A574'
              }
            }}
          />
          <Typography
            variant="body2" 
            sx={{
              color: '#6B4E37',
              fontWeight: 500,
              fontSize: '0.85rem'
            }}
          >
            {recipe.rating}
          </Typography>
        </Box>

        <Typography
          variant="body2" 
          sx={{
            color: '#8B6B47',
            fontSize: '0.9rem',
            lineHeight: 1.4,
            mb: 2
          }}
        >
          {isPublic
            ? `${recipe.author_name} • ${recipe.cooking_time}`
            : `${username} • ${recipe.cookTime ?? recipe.cooking_time}`
          }
        </Typography>

        {!isPublic && (
          type === 'my-recipe' ? (
            <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
              <Button
                variant="contained"
                size="small"
                onClick={onEdit}
                sx={{
                  flex: 1,
                  backgroundColor: '#8B6B47',
                  color: 'white',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  py: 1,
                  '&:hover': {
                    backgroundColor: '#6B4E37'
                  },
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none'
                  }
                }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={onView}
                sx={{
                  flex: 1,
                  borderColor: '#8B6B47',
                  color: '#8B6B47',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  py: 1,
                  '&:hover': {
                    borderColor: '#6B4E37',
                    backgroundColor: '#F5E2CC',
                    color: '#6B4E37'
                  },
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none'
                  }
                }}
              >
                View
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              fullWidth
              size="small"
              onClick={onView}
              sx={{
                backgroundColor: '#8B6B47',
                color: 'white',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.85rem',
                py: 1,
                '&:hover': {
                  backgroundColor: '#6B4E37'
                },
                '&:focus': {
                  outline: 'none',
                  boxShadow: 'none'
                }
              }}
            >
              View Recipe
            </Button>
          )
        )}
      </CardContent>
    </Card>
  );

  return isPublic && onClick ? <Box onClick={onClick}>{card}</Box> : card;
};

export default RecipeCard;