import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { QrCode, LogIn, Wrench, Shield, Zap, BarChart3 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface LandingPageProps {
    onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-400/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
            </div>

            {/* Header */}
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
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-blue-900">Toolroom Available</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-24 py-16 md:py-24 relative z-10 px-[64px] py-[90px]">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Column - Content */}
                    <div className="space-y-8 animate-fade-in">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-sm border border-blue-200 shadow-sm">
                                <Zap className="w-4 h-4" />
                                <span>DPR Aviation College</span>
                            </div>
                            <h1 className="text-blue-900 leading-tight font-bold">DPR Tool Management System</h1>
                            <p className="text-muted-foreground leading-relaxed text-[14px]">
                                Smart tool tracking system for DPR Aviation College's maintenance hangar. Reduce tool losses,
                                improve accountability, and automate recording of transactions with cutting-edge QR
                                technology.
                            </p>
                        </div>

                        {/* Action Cards */}
                        <div className="space-y-4">
                            <Card
                                className="border-2 border-blue-200 bg-gradient-to-br from-white via-blue-50/50 to-white hover:border-blue-400 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group overflow-hidden relative"
                                onClick={() => onNavigate("qr-scan")}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <CardContent className="p-6 relative z-10">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-blue-500/50 group-hover:scale-110 transition-all">
                                            <QrCode className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-blue-900 mb-2 flex items-center gap-2">
                                                Proceed to QR Scan
                                                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                                    Student
                                                </span>
                                            </h3>
                                            <p className="text-muted-foreground text-sm mb-4">
                                                For students - Scan tool QR codes to borrow or return items instantly
                                            </p>
                                            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md group-hover:shadow-lg transition-all">
                                                <QrCode className="w-4 h-4 mr-2" />
                                                Start Scanning
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card
                                className="border-2 border-slate-200 bg-gradient-to-br from-white via-slate-50/50 to-white hover:border-slate-400 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group overflow-hidden relative"
                                onClick={() => onNavigate("login")}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <CardContent className="p-6 relative z-10">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-slate-500/50 group-hover:scale-110 transition-all">
                                            <LogIn className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-blue-900 mb-2 flex items-center gap-2">
                                                Login as Instructor or Admin
                                                <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                                                    Staff
                                                </span>
                                            </h3>
                                            <p className="text-muted-foreground text-sm mb-4">
                                                Access management dashboard and comprehensive tool tracking features
                                            </p>
                                            <Button
                                                variant="outline"
                                                className="w-full border-slate-300 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-900 transition-all"
                                            >
                                                <LogIn className="w-4 h-4 mr-2" />
                                                Login
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-6 pt-6">
                            <div className="text-center group">
                                <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                    <QrCode className="w-6 h-6 text-blue-700" />
                                </div>
                                <div className="text-blue-700 mb-1">QR-Based</div>
                                <p className="text-sm text-muted-foreground">Quick scanning</p>
                            </div>
                            <div className="text-center group">
                                <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                    <BarChart3 className="w-6 h-6 text-green-700" />
                                </div>
                                <div className="text-green-700 mb-1">Digital Logs</div>
                                <p className="text-sm text-muted-foreground">Auto tracking</p>
                            </div>
                            <div className="text-center group">
                                <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                    <Zap className="w-6 h-6 text-purple-700" />
                                </div>
                                <div className="text-purple-700 mb-1">Real-time</div>
                                <p className="text-sm text-muted-foreground">Live updates</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Image */}
                    <div className="relative hidden md:block">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                            <ImageWithFallback
                                src="https://images.unsplash.com/photo-1696812198996-c57a38342ba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXJjcmFmdCUyMG1haW50ZW5hbmNlJTIwaGFuZ2FyfGVufDF8fHx8MTc2MDE4NTQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                                alt="Aircraft Maintenance Hangar"
                                className="w-full h-[500px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-blue-900/20 to-transparent"></div>

                            {/* Floating Stats Overlay */}
                            <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-4">
                                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                                    <p className="text-blue-700 mb-1">24/7</p>
                                    <p className="text-xs text-muted-foreground">System Uptime</p>
                                </div>
                                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                                    <p className="text-green-700 mb-1">99%</p>
                                    <p className="text-xs text-muted-foreground">Accuracy Rate</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-white/20 bg-white/90 backdrop-blur-md py-8 mt-auto relative z-10">
                <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-24 text-center">
                    <p className="text-muted-foreground">&copy; 2025 DPR Aviation College. All rights reserved.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Contact: toolmanagement@dpraviation.edu | +1 (555) 123-4567
                    </p>
                </div>
            </footer>
        </div>
    );
}
