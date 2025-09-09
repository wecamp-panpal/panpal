import { Route, Routes } from 'react-router-dom';
import AddRecipePage from './pages/add-recipe';
import HomeLayout from './layouts/home-layout';
import './App.css';

function App() {
  return (
    <Routes>
      <Route element={<HomeLayout />}>
        <Route path="/add-recipe" element={<AddRecipePage />} />
      </Route>
    </Routes>
  );
}

export default App;
