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
import LoginPage from "./pages/LoginPage";
import PersonalSettingPage from "./pages/PersonalSettingPage";
import ProtectedRoute from "./components/ProtectedRoute";
createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/log-in" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/personal-setting"
          element={
            <ProtectedRoute>
              <PersonalSettingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipe/:id"
          element={
            <ProtectedRoute>
              <RecipePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-all"
          element={
            <ProtectedRoute>
              <ViewAllPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-recipe"
          element={
            <ProtectedRoute>
              <PostRecipePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </AuthContextProvider>
  // <StrictMode>

  // </StrictMode>
);
