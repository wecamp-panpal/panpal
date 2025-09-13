import { Route, Routes } from 'react-router-dom';
import SignInPage from '@/pages/SignInPage';
import AddRecipePage from './pages/add-recipe';
import HomeLayout from './layouts/home-layout';
import { ThemeProvider } from '@mui/material/styles';
import { muiTheme } from '@/lib/muiTheme';
import LandingPage from '@/pages/LandingPage';
import './App.css';
import ProfilePage from '@/pages/Profile';
import ExploreRecipes from '@/pages/ExploreRecipes';
import RecipeDetailPage from '@/pages/RecipeDetailPage';
import SignUpPage from '@/pages/SignUpPage';

function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="/explore" element={<ExploreRecipes />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/add-recipe" element={<AddRecipePage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />

          <Route path="/sign-up" element={<SignUpPage />} />
        </Route>
        <Route path="/sign-in" element={<SignInPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
