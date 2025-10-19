import { Wrench } from "lucide-react";

interface HeaderProps {
  showStatus?: boolean;
  statusText?: string;
}

export function Header({ showStatus = true, statusText = "Toolroom Available" }: HeaderProps) {
  return (
    <header className="border-b border-white/20 bg-white/90 backdrop-blur-md shadow-sm relative z-10">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-24 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
            <Wrench className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-blue-900">DTMS</h1>
            <p className="text-muted-foreground text-xs">DPR Tool Management</p>
          </div>
        </div>
        {showStatus && (
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-900">{statusText}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
