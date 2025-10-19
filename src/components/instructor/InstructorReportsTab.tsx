import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { StatsCard } from "../dashboard/StatsCard";
import { Package, CheckCircle2, Clock, RefreshCw, Download, Printer } from "lucide-react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Tool {
    id: string;
    name: string;
    category: string;
    status: "available" | "unavailable";
    condition: "good" | "fair" | "needs-repair";
    totalQty: number;
    availableQty: number;
}

interface Transaction {
    id: string;
    status: string;
    borrowedAt: string;
}

interface InstructorReportsTabProps {
    tools: Tool[];
    transactions: Transaction[];
    borrowedCount: number;
    returnedCount: number;
    instructorName: string;
}

export function InstructorReportsTab({
    tools,
    transactions,
    borrowedCount,
    returnedCount,
    instructorName,
}: InstructorReportsTabProps) {
    // Stats
    const totalToolsQty = tools.reduce((sum, tool) => sum + tool.totalQty, 0);
    const availableToolsQty = tools.reduce((sum, tool) => sum + tool.availableQty, 0);

    const stats = [
        {
            label: "Total Tools in Inventory",
            value: totalToolsQty.toString(),
            icon: Package,
            color: "text-blue-700",
            bg: "bg-blue-100",
        },
        {
            label: "Available Tools",
            value: availableToolsQty.toString(),
            icon: CheckCircle2,
            color: "text-green-700",
            bg: "bg-green-100",
        },
        {
            label: "Tools Currently Borrowed",
            value: borrowedCount.toString(),
            icon: Clock,
            color: "text-amber-700",
            bg: "bg-amber-100",
        },
        {
            label: "Pending Turnover",
            value: returnedCount.toString(),
            icon: RefreshCw,
            color: "text-purple-700",
            bg: "bg-purple-100",
        },
    ];

    // Tools by Category (Pie Chart Data)
    const categoryData = useMemo(() => {
        const categories = new Map<string, number>();
        tools.forEach((tool) => {
            categories.set(tool.category, (categories.get(tool.category) || 0) + tool.totalQty);
        });
        return Array.from(categories.entries()).map(([name, value]) => ({ name, value }));
    }, [tools]);

    // Tool Status (Bar Chart Data)
    const statusData = useMemo(() => {
        const available = tools.reduce((sum, tool) => sum + (tool.status === "available" ? tool.availableQty : 0), 0);
        const borrowed = borrowedCount;

        return [
            { name: "Available", value: available, color: "#10b981" },
            { name: "Borrowed", value: borrowed, color: "#f59e0b" },
            { name: "Pending Turnover", value: returnedCount, color: "#8b5cf6" },
        ];
    }, [tools, borrowedCount, returnedCount]);

    // Borrowing Trend (Line Chart Data - Last 7 Days)
    const borrowingTrend = useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        });

        // Mock data for borrowed and returned - in real app, calculate from transactions
        const trendData = last7Days.map((day, index) => {
            const dayTransactions = transactions.filter((t) => {
                const tDate = new Date(t.borrowedAt);
                const checkDate = new Date();
                checkDate.setDate(checkDate.getDate() - (6 - index));
                return tDate.toDateString() === checkDate.toDateString();
            });

            return {
                day,
                borrowed: dayTransactions.filter(
                    (t) => t.status === "borrowed" || t.status === "returned" || t.status === "turned-over"
                ).length,
                returned: dayTransactions.filter((t) => t.status === "returned" || t.status === "turned-over").length,
            };
        });

        return trendData;
    }, [transactions]);

    const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

    // Export Report
    const downloadReport = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Instructor Tool Report", 14, 20);
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
        doc.text(`Instructor: ${instructorName}`, 14, 34);

        autoTable(doc, {
            startY: 40,
            head: [["Metric", "Value"]],
            body: stats.map((stat) => [stat.label, stat.value]),
        });

        doc.save("instructor-tool-report.pdf");
        toast.success("Report downloaded successfully");
    };

    const printReport = () => {
        window.print();
        toast.success("Printing report...");
    };

    return (
        <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-blue-900">Reports & Analytics</h2>
                    <p className="text-muted-foreground">Insights into your tool management</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={downloadReport}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                    </Button>
                    <Button variant="outline" onClick={printReport}>
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tools by Category - Pie Chart */}
                <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200 shadow-md">
                    <CardHeader>
                        <CardTitle>Tools by Category</CardTitle>
                        <CardDescription>Distribution of tools in your inventory</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry) => entry.name}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categoryData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Tool Status - Bar Chart */}
                <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200 shadow-md">
                    <CardHeader>
                        <CardTitle>Tool Status</CardTitle>
                        <CardDescription>Current availability of tools</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={statusData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#3b82f6">
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Borrowing Trend - Line Chart */}
            <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200 shadow-md">
                <CardHeader>
                    <CardTitle>Borrowing Trend (Last 7 Days)</CardTitle>
                    <CardDescription>Daily borrowing and return activity</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={borrowingTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="borrowed" stroke="#f59e0b" strokeWidth={2} name="Borrowed" />
                            <Line type="monotone" dataKey="returned" stroke="#10b981" strokeWidth={2} name="Returned" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
