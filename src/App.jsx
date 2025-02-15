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
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on initial load
  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
  }, []);

  return (
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

        {/* Protected Routes: Wrap everything else in a Route */}
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
                  <div className="">
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
  );
}

export default App;
