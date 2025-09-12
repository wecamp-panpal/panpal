import { Route, Routes } from 'react-router-dom';
import AddRecipePage from './pages/add-recipe';
import HomeLayout from './layouts/home-layout';
import { ThemeProvider } from "@mui/material/styles";
import { muiTheme } from "@/lib/muiTheme";
import LandingPage from "@/pages/LandingPage";
import './App.css';
import ProfilePage from '@/pages/Profile';

function App() {
  return (
     <ThemeProvider theme={muiTheme}>
    <Routes>
      <Route element={<HomeLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/add-recipe" element={<AddRecipePage />} />
      </Route>
    </Routes>
    </ThemeProvider>

  );
}

export default App;
