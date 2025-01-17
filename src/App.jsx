// src/App.js
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { AppSidebar } from "@/components/app-sidebar";
import Home from "./pages/home";
import BusinessSuite from "@/pages/business-suite";
import Instagram from "@/pages/instagram";
import Login from "./pages/login";
import "./App.css";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
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
                {isSidebarOpen && (
                  <AppSidebar setIsAuthenticated={setIsAuthenticated} />
                )}
                <div className="relative w-full">
                  <SidebarTrigger
                    className="absolute top-0 left-0 mt-2 ml-2 w-10 h-10"
                    style={{ zIndex: 3 }}
                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                  />
                  <div className="">
                    <Routes>
                      <Route path="/home" element={<Home />} />
                      <Route
                        path="/business-suite"
                        element={<BusinessSuite />}
                      />
                      <Route path="/instagram" element={<Instagram />} />
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