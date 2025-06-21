import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import HomePage from "./pages/HomePage";
import { AuthContextProvider } from "./context/authContext";
import { UserContextProvider } from "./context/userContext";
import { CategoryContextProvider } from "./context/categoryContext";
import { RecipeContextProvider } from "./context/recipeContext";
import RecipePage from "./pages/RecipePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/recipe/:id" element={<RecipePage />} />
    </Routes>
  </BrowserRouter>
  // </StrictMode>
);
