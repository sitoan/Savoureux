// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import HomePage from "./pages/HomePage";
import { AuthContextProvider } from "./context/authContext";
// import RecipePage from "./pages/RecipePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RecipePage from "./pages/RecipePage";

createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
      </Routes>
    </BrowserRouter>
  </AuthContextProvider>
  // <StrictMode>

  // </StrictMode>
);
