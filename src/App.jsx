import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { AppSidebar } from "@/components/app-sidebar";
import BusinessSuite from "@/pages/business-suite";
import Instagram from "@/pages/instagram";
import "./App.css";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
      <SidebarProvider
        style={{
          "--sidebar-width": "14rem",
          "--sidebar-width-mobile": "20rem",
        }}
      >
        {isSidebarOpen && <AppSidebar />}
        <div className="relative w-full">
          <SidebarTrigger
            className="absolute top-0 left-0 mt-2 ml-2 w-10 h-10"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          />
          <div className="">
            <Routes>
              <Route path="/" element={<div>Hello</div>} />
              <Route path="/business-suite" element={<BusinessSuite />} />
              <Route path="/instagram" element={<Instagram />} />
            </Routes>
          </div>
        </div>
        <Toaster />
      </SidebarProvider>
    </Router>
  );
}

export default App;
