import { useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { InstructorDashboard } from "./pages/InstructorDashboard";
import { StudentQRAccess } from "./pages/StudentQRAccess";
import { ReportsPage } from "./pages/ReportsPage";
import { Toaster } from "./components/ui/sonner";
import { AppProvider } from "./contexts/AppContext";

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
