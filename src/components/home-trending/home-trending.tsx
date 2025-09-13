import RecipeCard from '../recipes/recipe-card';
import { Typography } from '@mui/material';

const Trending = () => {
  const recipes = [
    {
      id: 1,
      title: 'Spaghetti Carbonara',
      image: '/images/spaghetti.jpg',
      author: 'Anna',
      rating: 4.8,
    },
    { id: 2, title: 'Pho Bo', image: '/images/pho.jpg', author: 'Minh', rating: 4.9 },
    { id: 3, title: 'Sushi', image: '/images/sushi.jpg', author: 'Yuki', rating: 4.7 },
    { id: 4, title: 'Tacos', image: '/images/tacos.jpg', author: 'Carlos', rating: 4.6 },
  ];

  return (
    <section className="w-full pt-16 pb-32 px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-start relative gap-8">
          <Typography
            variant="h2"
            sx={{
              marginBottom: '24px',
              fontSize: '52px',
              fontWeight: 500,
            }}
          >
            Trending
          </Typography>
        </div>
        <div className="flex flex-wrap gap-8 mt-4">
          {recipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={{
                id: recipe.id,
                title: recipe.title,
                description: '', 
                image: recipe.image,
                cookTime: '', 
                cooking_time: '',
                difficulty: '', 
                rating: recipe.rating,
                category: '', 
                author_name: recipe.author,
              }}
              variant="public"
            />
          ))}
        </div>
        <Typography
          variant="h2"
          sx={{
            marginTop: 3,
            fontSize: '52px',
            fontWeight: 500,
          }}
        >
          Based on your Favourite
        </Typography>
        <div className="flex flex-wrap gap-8 mt-4">
          {recipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={{
                id: recipe.id,
                title: recipe.title,
                description: '', 
                image: recipe.image,
                cookTime: '', 
                cooking_time: '',
                difficulty: '', 
                rating: recipe.rating,
                category: '', 
                author_name: recipe.author,
              }}
              variant="public"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trending;
