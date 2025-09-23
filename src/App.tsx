import { Route, Routes } from 'react-router-dom';
import SignInPage from '@/pages/sign-in-page';
import AddRecipePage from './pages/add-recipe';
import EditRecipePage from './pages/edit-recipe-page';
import HomeLayout from './layouts/home-layout';
import { ThemeProvider } from '@mui/material/styles';
import { muiTheme } from '@/lib/muiTheme';
import LandingPage from '@/pages/landing-page';
import './App.css';
import ProfilePage from '@/pages/Profile';
import ExploreRecipes from '@/pages/explore-recipe';
import RecipeDetailPage from '@/pages/recipe-detail-page';
import SignUpPage from '@/pages/sign-up-page';
import NotFound from '@/pages/not-found';
import { Toaster } from 'react-hot-toast';
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
          <Route path="/recipes/:id/edit" element={<EditRecipePage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
      </Routes>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#363636', color: '#fff' },
          success: { style: { background: '#4ade80' } },
          error: { style: { background: '#ef4444' } },
        }}
      />
    </ThemeProvider>
  );
}

export default App;
