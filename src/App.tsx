import { Route, Routes } from 'react-router-dom';
import SignInPage from '@/pages/SignInPage';
import AddRecipePage from './pages/add-recipe';
import EditRecipePage from './pages/EditRecipePage';
import HomeLayout from './layouts/home-layout';
import { ThemeProvider } from '@mui/material/styles';
import { muiTheme } from '@/lib/muiTheme';
import LandingPage from '@/pages/LandingPage';
import './App.css';
import ProfilePage from '@/pages/Profile';
import ExploreRecipes from '@/pages/ExploreRecipes';
import RecipeDetailPage from '@/pages/RecipeDetailPage';
import SignUpPage from '@/pages/SignUpPage';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth-guard/ProtectedRoute';
function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <AuthProvider>
        <Routes>
          <Route element={<HomeLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="/explore" element={<ExploreRecipes />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/add-recipe" element={<ProtectedRoute><AddRecipePage /></ProtectedRoute>} />
            <Route path="/recipes/:id" element={<RecipeDetailPage />} />
            <Route path="/recipes/:id/edit" element={<ProtectedRoute><EditRecipePage /></ProtectedRoute>} />

            
          </Route>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
