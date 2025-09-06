

import { Route, Routes } from "react-router-dom";
import AddRecipePage from "./pages/AddRecipe";
import HomeLayout from "./layouts/HomLayout";


function App() {

  return (
    <Routes>
       <Route element={<HomeLayout />}> 
    <Route path="/add-recipe" element={<AddRecipePage/>}/>
</Route>
    </Routes>
  );
}

export default App;
