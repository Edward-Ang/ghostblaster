// src/App.js
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { AppSidebar } from "@/components/app-sidebar";
import Home from "./pages/home";
import BusinessSuite from "@/pages/business-suite";
import Instagram from "@/pages/instagram";
import Login from "./pages/login";
import Signup from "./pages/signup";
import AddAccount from "./pages/add-account";
import "./App.css";
import ProfilePage from "./pages/profile";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ThemeProvider } from "@/contexts/ThemeContext";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // ⚡ Add loading state

  // ✅ Check authentication status on initial load
  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
    setLoading(false); // ⏳ Delay loading state by 10 seconds
  }, []);

  if (loading) {
    return (
      <ThemeProvider>
        <div className="flex items-center justify-center h-screen dark:bg-gray-900">
          <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-500" />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Route: Login Page */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <Login setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              isAuthenticated ? (
                <SidebarProvider
                  style={{
                    "--sidebar-width": "14rem",
                    "--sidebar-width-mobile": "20rem",
                  }}
                >
                  <AppSidebar setIsAuthenticated={setIsAuthenticated} />
                  <div className="relative w-full">
                    <Routes>
                      <Route path="/home" element={<Home />} />
                      <Route
                        path="/business-suite"
                        element={<BusinessSuite />}
                      />
                      <Route path="/instagram" element={<Instagram />} />
                      <Route path="/add-account" element={<AddAccount />} />
                      <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                  </div>
                  <Toaster />
                </SidebarProvider>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
