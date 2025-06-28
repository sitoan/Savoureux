// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import HomePage from "./pages/HomePage";
import { AuthContextProvider } from "./context/authContext";
// import RecipePage from "./pages/RecipePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RecipePage from "./pages/RecipePage";
import PostRecipePage from "./pages/PostRecipePage";
import ViewAllPage from "./pages/ViewAllPage";

createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
        <Route path="/view-all" element={<ViewAllPage />} />
        <Route path="/post-recipe" element={<PostRecipePage />} />
      </Routes>
    </BrowserRouter>
  </AuthContextProvider>
  // <StrictMode>

  // </StrictMode>
);
