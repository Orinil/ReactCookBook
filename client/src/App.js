import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from './core/Layout';
import Recipes from "./components/Recipe/Recipes";
import Categories from "./components/Category/Categories";
import RecipeDetail from "./components/Recipe/Detail/RecipeDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
            <Route index element={<Recipes/>} />
            <Route path="categoriesList" element={<Categories/>} />
            <Route path="recipe/:id" element={<RecipeDetail/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
