import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import HomePage from "./pages/HomePage";
import { AuthContextProvider } from "./context/authContext";
import { UserContextProvider } from "./context/userContext";
import { CategoryContextProvider } from "./context/categoryContext";
import { RecipeContextProvider } from "./context/recipeContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <UserContextProvider>
        <CategoryContextProvider>
          <RecipeContextProvider>
            <HomePage />
          </RecipeContextProvider>
        </CategoryContextProvider>
      </UserContextProvider>
    </AuthContextProvider>
  </StrictMode>
);
