import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { InstructorDashboard } from "./components/InstructorDashboard";
import { StudentQRAccess } from "./components/StudentQRAccess";
import { ReportsPage } from "./components/ReportsPage";
import { Toaster } from "./components/ui/sonner";
import { AppProvider } from "./components/AppContext";

type Page = "landing" | "login" | "qr-scan" | "admin-dashboard" | "instructor-dashboard" | "reports";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [userRole, setUserRole] = useState<string>("");

  const handleNavigate = (page: string, role?: string) => {
    setCurrentPage(page as Page);
    if (role) {
      setUserRole(role);
    }
  };

  return (
    <AppProvider>
      <div className="size-full">
        {currentPage === "landing" && <LandingPage onNavigate={handleNavigate} />}
        {currentPage === "login" && <LoginPage onNavigate={handleNavigate} />}
        {currentPage === "qr-scan" && <StudentQRAccess onNavigate={handleNavigate} />}
        {currentPage === "admin-dashboard" && <AdminDashboard onNavigate={handleNavigate} />}
        {currentPage === "instructor-dashboard" && <InstructorDashboard onNavigate={handleNavigate} />}
        {currentPage === "reports" && <ReportsPage onNavigate={handleNavigate} />}
        <Toaster />
      </div>
    </AppProvider>
  );
}
