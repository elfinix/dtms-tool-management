import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { ArrowLeft, Download, FileText, Calendar, TrendingUp, Award, Clock, Printer } from "lucide-react";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

interface ReportsPageProps {
    onNavigate: (page: string) => void;
}

export function ReportsPage({ onNavigate }: ReportsPageProps) {
    const [dateRange, setDateRange] = useState("7days");
    const [filterUser, setFilterUser] = useState("all");
    const [filterTool, setFilterTool] = useState("all");

    // Mock data for charts
    const borrowFrequencyData = [
        { name: "Torque Wrench", count: 45 },
        { name: "Multimeter", count: 38 },
        { name: "Socket Set", count: 32 },
        { name: "Wire Stripper", count: 28 },
        { name: "Drill Set", count: 25 },
        { name: "Pliers", count: 22 },
    ];

    const complianceData = [
        { name: "On Time", value: 85, color: "#22c55e" },
        { name: "Late", value: 12, color: "#eab308" },
        { name: "Overdue", value: 3, color: "#ef4444" },
    ];

    const studentLevelData = [
        { level: "1st Year", borrows: 120 },
        { level: "2nd Year", borrows: 145 },
        { level: "3rd Year", borrows: 165 },
        { level: "4th Year", borrows: 98 },
    ];

    const weeklyTrendData = [
        { day: "Mon", borrows: 28, returns: 24 },
        { day: "Tue", borrows: 32, returns: 30 },
        { day: "Wed", borrows: 35, returns: 31 },
        { day: "Thu", borrows: 30, returns: 28 },
        { day: "Fri", borrows: 38, returns: 35 },
        { day: "Sat", borrows: 15, returns: 18 },
        { day: "Sun", borrows: 8, returns: 12 },
    ];

    const topBorrowers = [
        { rank: 1, name: "Sarah Johnson", id: "S-2024-023", borrows: 24, returns: 24, compliance: 100 },
        { rank: 2, name: "Mike Davis", id: "S-2024-045", borrows: 22, returns: 21, compliance: 95 },
        { rank: 3, name: "John Smith", id: "S-2024-001", borrows: 21, returns: 20, compliance: 95 },
        { rank: 4, name: "Emily Brown", id: "S-2024-067", borrows: 19, returns: 19, compliance: 100 },
        { rank: 5, name: "David Wilson", id: "S-2024-089", borrows: 18, returns: 17, compliance: 94 },
    ];

    const handleExportPDF = () => {
        const doc = new jsPDF();
        const currentDate = new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        // Header
        doc.setFontSize(20);
        doc.setTextColor(30, 64, 175); // Blue color
        doc.text("DPR Tool Management System", 14, 20);

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Analytics & Reports", 14, 30);

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${currentDate}`, 14, 38);
        doc.text(
            `Date Range: ${
                dateRange === "7days"
                    ? "Last 7 Days"
                    : dateRange === "30days"
                    ? "Last 30 Days"
                    : dateRange === "90days"
                    ? "Last 90 Days"
                    : "This Year"
            }`,
            14,
            44
        );

        // Summary Statistics
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Summary Statistics", 14, 56);

        const statsData = [
            ["Total Transactions", "528", "+12% from last period"],
            ["Return Compliance", "85%", "+3% improvement"],
            ["Avg. Borrow Time", "3.2 hrs", "Within limits"],
            ["Peak Hours", "9-11 AM", "Active period"],
        ];

        autoTable(doc, {
            startY: 60,
            head: [["Metric", "Value", "Trend"]],
            body: statsData,
            theme: "grid",
            headStyles: { fillColor: [30, 64, 175], textColor: 255 },
            margin: { left: 14, right: 14 },
        });

        // Most Borrowed Tools
        let finalY = (doc as any).lastAutoTable.finalY || 100;
        doc.setFontSize(12);
        doc.text("Most Borrowed Tools", 14, finalY + 10);

        const toolsData = borrowFrequencyData.map((t) => [t.name, t.count.toString()]);

        autoTable(doc, {
            startY: finalY + 14,
            head: [["Tool Name", "Borrow Count"]],
            body: toolsData,
            theme: "striped",
            headStyles: { fillColor: [30, 64, 175], textColor: 255 },
            margin: { left: 14, right: 14 },
        });

        // Return Compliance
        finalY = (doc as any).lastAutoTable.finalY || 160;
        doc.setFontSize(12);
        doc.text("Return Compliance", 14, finalY + 10);

        const complianceTableData = complianceData.map((c) => [c.name, `${c.value}%`]);

        autoTable(doc, {
            startY: finalY + 14,
            head: [["Status", "Percentage"]],
            body: complianceTableData,
            theme: "grid",
            headStyles: { fillColor: [30, 64, 175], textColor: 255 },
            margin: { left: 14, right: 14 },
        });

        // Top Borrowers - New Page
        doc.addPage();
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Top Borrowers", 14, 20);

        const borrowersData = topBorrowers.map((b) => [
            b.rank.toString(),
            b.name,
            b.id,
            b.borrows.toString(),
            b.returns.toString(),
            `${b.compliance}%`,
        ]);

        autoTable(doc, {
            startY: 24,
            head: [["Rank", "Name", "Student ID", "Borrows", "Returns", "Compliance"]],
            body: borrowersData,
            theme: "striped",
            headStyles: { fillColor: [30, 64, 175], textColor: 255 },
            margin: { left: 14, right: 14 },
            styles: { fontSize: 9 },
        });

        // Student Level Data
        finalY = (doc as any).lastAutoTable.finalY || 100;
        doc.setFontSize(12);
        doc.text("Borrows by Student Level", 14, finalY + 10);

        const levelData = studentLevelData.map((s) => [s.level, s.borrows.toString()]);

        autoTable(doc, {
            startY: finalY + 14,
            head: [["Academic Level", "Total Borrows"]],
            body: levelData,
            theme: "grid",
            headStyles: { fillColor: [30, 64, 175], textColor: 255 },
            margin: { left: 14, right: 14 },
        });

        // Weekly Trend
        finalY = (doc as any).lastAutoTable.finalY || 180;
        doc.setFontSize(12);
        doc.text("Weekly Activity Trend", 14, finalY + 10);

        const weeklyData = weeklyTrendData.map((w) => [w.day, w.borrows.toString(), w.returns.toString()]);

        autoTable(doc, {
            startY: finalY + 14,
            head: [["Day", "Borrows", "Returns"]],
            body: weeklyData,
            theme: "striped",
            headStyles: { fillColor: [30, 64, 175], textColor: 255 },
            margin: { left: 14, right: 14 },
        });

        // Footer on all pages
        const pageCount = (doc as any).internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(
                `Page ${i} of ${pageCount}`,
                doc.internal.pageSize.getWidth() / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: "center" }
            );
            doc.text(
                "DPR Aviation College - Tool Management System",
                doc.internal.pageSize.getWidth() / 2,
                doc.internal.pageSize.getHeight() - 6,
                { align: "center" }
            );
        }

        doc.save(`DTMS_Analytics_Report_${new Date().toISOString().split("T")[0]}.pdf`);
        toast.success("Report downloaded successfully");
    };

    const handlePrint = () => {
        window.print();
        toast.success("Opening print dialog...");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-10 shadow-sm print:hidden">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" onClick={() => onNavigate("admin-dashboard")}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </Button>
                            <div>
                                <h1 className="text-blue-900">Reports & Analytics</h1>
                                <p className="text-sm text-muted-foreground">Tool usage data and insights</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="border-slate-300 hover:bg-slate-50" onClick={handlePrint}>
                                <Printer className="w-4 h-4 mr-2" />
                                Print
                            </Button>
                            <Button
                                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md"
                                onClick={handleExportPDF}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Filters */}
                <Card className="mb-8 bg-gradient-to-br from-white to-slate-50/50 border-slate-200 shadow-md print:shadow-none">
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                        <CardDescription>Customize your report view</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Date Range</Label>
                                <Select value={dateRange} onValueChange={setDateRange}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7days">Last 7 Days</SelectItem>
                                        <SelectItem value="30days">Last 30 Days</SelectItem>
                                        <SelectItem value="90days">Last 90 Days</SelectItem>
                                        <SelectItem value="year">This Year</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>User Type</Label>
                                <Select value={filterUser} onValueChange={setFilterUser}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Users</SelectItem>
                                        <SelectItem value="students">Students Only</SelectItem>
                                        <SelectItem value="instructors">Instructors Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Tool Type</Label>
                                <Select value={filterTool} onValueChange={setFilterTool}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Tools</SelectItem>
                                        <SelectItem value="hand">Hand Tools</SelectItem>
                                        <SelectItem value="power">Power Tools</SelectItem>
                                        <SelectItem value="measuring">Measuring Tools</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100 shadow-md hover:shadow-lg transition-shadow print:shadow-none">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm mb-1">Total Transactions</p>
                                    <p className="text-blue-700">528</p>
                                    <p className="text-xs text-green-600 mt-1">↑ 12% from last period</p>
                                </div>
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shadow-sm">
                                    <TrendingUp className="w-5 h-5 text-blue-700" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-white to-green-50 border-green-100 shadow-md hover:shadow-lg transition-shadow print:shadow-none">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm mb-1">Return Compliance</p>
                                    <p className="text-green-700">85%</p>
                                    <p className="text-xs text-green-600 mt-1">↑ 3% improvement</p>
                                </div>
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shadow-sm">
                                    <Award className="w-5 h-5 text-green-700" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-100 shadow-md hover:shadow-lg transition-shadow print:shadow-none">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm mb-1">Avg. Borrow Time</p>
                                    <p className="text-purple-700">3.2 hrs</p>
                                    <p className="text-xs text-muted-foreground mt-1">Within limits</p>
                                </div>
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shadow-sm">
                                    <Clock className="w-5 h-5 text-purple-700" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-100 shadow-md hover:shadow-lg transition-shadow print:shadow-none">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm mb-1">Active Period</p>
                                    <p className="text-orange-700">9-11 AM</p>
                                    <p className="text-xs text-muted-foreground mt-1">Peak hours</p>
                                </div>
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shadow-sm">
                                    <Calendar className="w-5 h-5 text-orange-700" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Most Borrowed Tools */}
                    <Card className="bg-gradient-to-br from-white to-blue-50/30 border-blue-100 shadow-md print:shadow-none print:break-inside-avoid">
                        <CardHeader>
                            <CardTitle>Most Borrowed Tools</CardTitle>
                            <CardDescription>Top 6 tools by borrow frequency</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={borrowFrequencyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Return Compliance */}
                    <Card className="bg-gradient-to-br from-white to-green-50/30 border-green-100 shadow-md print:shadow-none print:break-inside-avoid">
                        <CardHeader>
                            <CardTitle>Tool Return Compliance</CardTitle>
                            <CardDescription>On-time vs late returns</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={complianceData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {complianceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Student Level Borrows */}
                    <Card className="bg-gradient-to-br from-white to-purple-50/30 border-purple-100 shadow-md print:shadow-none print:break-inside-avoid">
                        <CardHeader>
                            <CardTitle>Borrow Frequency by Student Level</CardTitle>
                            <CardDescription>Total borrows per academic level</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={studentLevelData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="level" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="borrows" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Weekly Trend */}
                    <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200 shadow-md print:shadow-none print:break-inside-avoid">
                        <CardHeader>
                            <CardTitle>Weekly Activity Trend</CardTitle>
                            <CardDescription>Daily borrows vs returns</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={weeklyTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="borrows" stroke="#3b82f6" strokeWidth={2} />
                                    <Line type="monotone" dataKey="returns" stroke="#22c55e" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Borrowers Table */}
                <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200 shadow-md print:shadow-none print:break-inside-avoid">
                    <CardHeader>
                        <CardTitle>Top Borrowers</CardTitle>
                        <CardDescription>Students with highest tool usage</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {topBorrowers.map((borrower) => (
                                <div
                                    key={borrower.rank}
                                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                borrower.rank === 1
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : borrower.rank === 2
                                                    ? "bg-slate-100 text-slate-700"
                                                    : borrower.rank === 3
                                                    ? "bg-orange-100 text-orange-700"
                                                    : "bg-blue-100 text-blue-700"
                                            }`}
                                        >
                                            #{borrower.rank}
                                        </div>
                                        <div>
                                            <p className="text-blue-900">{borrower.name}</p>
                                            <p className="text-sm text-muted-foreground">{borrower.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-center">
                                            <p className="text-sm text-muted-foreground">Borrows</p>
                                            <p>{borrower.borrows}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-muted-foreground">Returns</p>
                                            <p>{borrower.returns}</p>
                                        </div>
                                        <div className="text-center">
                                            <Badge
                                                variant="outline"
                                                className={
                                                    borrower.compliance === 100
                                                        ? "bg-green-50 text-green-700 border-green-200"
                                                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                }
                                            >
                                                {borrower.compliance}% compliance
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
