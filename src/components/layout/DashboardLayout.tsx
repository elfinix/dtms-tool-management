import { ReactNode } from "react";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  onMobileMenuToggle?: () => void;
  showMobileMenu?: boolean;
}

export function DashboardLayout({
  children,
  title,
  description,
  onMobileMenuToggle,
  showMobileMenu = true,
}: DashboardLayoutProps) {
  return (
    <main className="flex-1 overflow-auto">
      <div className="p-4 md:p-8">
        {/* Mobile Menu Button */}
        {showMobileMenu && onMobileMenuToggle && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mb-4"
            onClick={onMobileMenuToggle}
          >
            <Menu className="w-6 h-6" />
          </Button>
        )}

        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-blue-900 mb-2">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {/* Content */}
        {children}
      </div>
    </main>
  );
}
