import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import HomePage from "../pages/HomePage";
import NoteDetails from "../pages/NoteDetails";
import CreatePage from "../pages/CreatePage";
import AboutPage from "../pages/AboutPage";
import ResourcePage from "../pages/ResourcePage";
import NavBar from "../components/NavBar";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicOnlyRoute from "../components/PublicOnlyRoute";
import { AuthProvider } from "../features/auth/AuthContext";

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    // Router handles client-side navigation between page components.
    <AuthProvider>
      <Router>
        <div
          data-theme={theme}
          className="relative min-h-screen overflow-x-hidden bg-base-200"
        >
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10" />
          <div className="pointer-events-none absolute -top-24 left-10 -z-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-20 right-10 -z-10 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />

          {/* Global navigation shared across pages */}
          <NavBar theme={theme} onToggleTheme={toggleTheme} />
          <Toaster position="top-right" />

          {/* Route table mapping URLs to page components */}
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/resource" element={<ResourcePage />} />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <RegisterPage />
                </PublicOnlyRoute>
              }
            />
            <Route path="/note/:id" element={<NoteDetails />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
