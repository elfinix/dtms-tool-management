import { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "./ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
    LayoutDashboard,
    PackagePlus,
    PackageMinus,
    History,
    FileText,
    Wrench,
    LogOut,
    QrCode,
    CheckCircle2,
    X,
    Search,
    Filter,
    Clock,
    Users,
    Download,
    Printer,
    Menu,
    Package,
    Edit,
    Trash2,
    Plus,
    RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ImageWithFallback } from "./figma/ImageWithFallback";
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
import { useAppContext } from "./AppContext";

interface InstructorDashboardProps {
    onNavigate: (page: string) => void;
}

const INSTRUCTOR_ID = "I-001"; // Simulated logged-in instructor
const INSTRUCTOR_NAME = "Prof. Richard Anderson";

export function InstructorDashboard({ onNavigate }: InstructorDashboardProps) {
    const {
        getToolsByInstructor,
        getTransactionsByInstructor,
        getReturnedToolsByInstructor,
        returnTool,
        createPendingTransaction,
        markToolAsTurnedOver,
        markAllAsTurnedOver,
        addTool,
        updateTool,
        removeTool,
        updateInstructorShiftTime,
        getInstructorById,
    } = useAppContext();

    const [activeTab, setActiveTab] = useState("dashboard");
    const [selectedTools, setSelectedTools] = useState<string[]>([]);
    const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
    const [showQRDialog, setShowQRDialog] = useState(false);
    const [generatedTransactionId, setGeneratedTransactionId] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [dateFilter, setDateFilter] = useState("all");
    const [sectionFilter, setSectionFilter] = useState("all");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Tool Inventory filters
    const [toolSearchQuery, setToolSearchQuery] = useState("");
    const [toolStatusFilter, setToolStatusFilter] = useState("all");
    const [toolConditionFilter, setToolConditionFilter] = useState("all");

    // Shift time management
    const currentInstructor = getInstructorById(INSTRUCTOR_ID);
    const [shiftEndTime, setShiftEndTime] = useState(currentInstructor?.shiftEndTime || "14:00");
    const [isEditShiftDialogOpen, setIsEditShiftDialogOpen] = useState(false);

    // Tool Inventory state
    const [isAddToolDialogOpen, setIsAddToolDialogOpen] = useState(false);
    const [isEditToolDialogOpen, setIsEditToolDialogOpen] = useState(false);
    const [isDeleteToolDialogOpen, setIsDeleteToolDialogOpen] = useState(false);
    const [editingTool, setEditingTool] = useState<any>(null);
    const [deletingToolId, setDeletingToolId] = useState<string>("");
    const [newToolData, setNewToolData] = useState({
        name: "",
        category: "",
        location: "",
        condition: "good" as "good" | "fair" | "needs-repair",
        image: "",
        totalQty: 1,
        availableQty: 1,
        status: "available" as "available" | "unavailable",
    });

    // Get instructor's tools
    const instructorTools = getToolsByInstructor(INSTRUCTOR_ID);

    // Get instructor's transactions
    const instructorTransactions = getTransactionsByInstructor(INSTRUCTOR_ID);

    // Get returned tools ready for turnover
    const returnedTools = getReturnedToolsByInstructor(INSTRUCTOR_ID);

    // Get borrowed tools
    const borrowedTools = useMemo(() => {
        return instructorTransactions
            .filter((t) => t.status === "borrowed")
            .map((t) => {
                const tool = instructorTools.find((tool) => tool.id === t.toolId);
                return {
                    toolId: t.toolId,
                    toolName: t.toolName,
                    studentName: t.studentName,
                    studentId: t.studentId,
                    section: t.section,
                    borrowedTime: new Date(t.borrowedAt).toLocaleTimeString(),
                    dueTime: new Date(t.dueDate).toLocaleTimeString(),
                    image: tool?.image || "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400",
                    transactionId: t.id,
                    quantity: t.quantity,
                };
            });
    }, [instructorTransactions, instructorTools]);

    // Get all transactions for history
    const historyTransactions = useMemo(() => {
        return instructorTransactions.map((t) => ({
            id: t.id,
            toolId: t.toolId,
            toolName: t.toolName,
            studentName: t.studentName,
            studentId: t.studentId,
            action:
                t.status === "borrowed"
                    ? "Borrowed"
                    : t.status === "returned"
                    ? "Returned"
                    : t.status === "turned-over"
                    ? "Turned Over"
                    : "Pending",
            date: new Date(t.borrowedAt).toLocaleDateString(),
            time: new Date(t.borrowedAt).toLocaleTimeString(),
            section: t.section || "N/A",
            status: t.status,
            returnedTime: t.returnedAt ? new Date(t.returnedAt).toLocaleTimeString() : null,
            turnedOverTime: t.turnedOverAt ? new Date(t.turnedOverAt).toLocaleTimeString() : null,
            quantity: t.quantity,
        }));
    }, [instructorTransactions]);

    const currentDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "inventory", label: "Tool Inventory", icon: Package },
        { id: "issue", label: "Issue Tool", icon: PackagePlus },
        { id: "return", label: "Return Tool", icon: PackageMinus },
        { id: "turnover", label: "Turnover Tool", icon: RefreshCw },
        { id: "history", label: "History", icon: History },
        { id: "reports", label: "Reports", icon: FileText },
    ];

    // Filter history based on search, date, and section
    const filteredHistory = historyTransactions.filter((transaction) => {
        const matchesSearch =
            searchQuery === "" ||
            transaction.toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.toolId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSection = sectionFilter === "all" || transaction.section === sectionFilter;

        const matchesDate = (() => {
            if (dateFilter === "all") return true;
            const transactionDate = new Date(transaction.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (dateFilter === "today") {
                return transactionDate.toDateString() === today.toDateString();
            } else if (dateFilter === "week") {
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                return transactionDate >= weekAgo;
            } else if (dateFilter === "month") {
                const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                return transactionDate >= monthAgo;
            }
            return true;
        })();

        return matchesSearch && matchesSection && matchesDate;
    });

    const handleIssueTools = () => {
        if (selectedTools.length === 0) {
            toast.error("Please select at least one tool");
            return;
        }

        // Check if all selected tools have valid quantities
        for (const toolId of selectedTools) {
            const qty = selectedQuantities[toolId] || 1;
            const tool = instructorTools.find((t) => t.id === toolId);
            if (tool && qty > tool.availableQty) {
                toast.error(`Not enough quantity available for ${tool.name}`);
                return;
            }
        }

        // Create transaction for the first selected tool
        const firstToolId = selectedTools[0];
        const quantity = selectedQuantities[firstToolId] || 1;
        const transactionId = createPendingTransaction(firstToolId, INSTRUCTOR_NAME, INSTRUCTOR_ID, quantity);

        if (transactionId) {
            setGeneratedTransactionId(transactionId);
            setShowQRDialog(true);
            setSelectedTools([]);
            setSelectedQuantities({});
            toast.success(`Transaction ${transactionId} created. QR code generated.`);
        }
    };

    const handleReturnTool = (transactionId: string) => {
        returnTool(transactionId);
        toast.success("Tool marked as returned and ready for turnover");
    };

    const handleTurnoverTool = (transactionId: string) => {
        markToolAsTurnedOver(transactionId);
        toast.success("Tool marked as turned over to admin");
    };

    const handleTurnoverAll = () => {
        markAllAsTurnedOver(INSTRUCTOR_ID);
        toast.success("All returned tools marked as turned over to admin");
    };

    const toggleToolSelection = (toolId: string) => {
        setSelectedTools((prev) => (prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]));

        // Initialize quantity if not set
        if (!selectedQuantities[toolId]) {
            setSelectedQuantities((prev) => ({ ...prev, [toolId]: 1 }));
        }
    };

    const updateQuantity = (toolId: string, quantity: number) => {
        const tool = instructorTools.find((t) => t.id === toolId);
        if (tool && quantity > 0 && quantity <= tool.availableQty) {
            setSelectedQuantities((prev) => ({ ...prev, [toolId]: quantity }));
        }
    };

    // Tool management functions
    const handleAddTool = () => {
        if (!newToolData.name || !newToolData.category || !newToolData.location) {
            toast.error("Please fill in all required fields");
            return;
        }

        addTool({
            ...newToolData,
            instructorId: INSTRUCTOR_ID,
        });

        toast.success("Tool added successfully");
        setIsAddToolDialogOpen(false);
        setNewToolData({
            name: "",
            category: "",
            location: "",
            condition: "good",
            image: "",
            totalQty: 1,
            availableQty: 1,
            status: "available",
        });
    };

    const openEditToolDialog = (tool: any) => {
        setEditingTool(tool);
        setIsEditToolDialogOpen(true);
    };

    const handleEditTool = () => {
        if (!editingTool) return;

        updateTool(editingTool.id, {
            name: editingTool.name,
            category: editingTool.category,
            location: editingTool.location,
            condition: editingTool.condition,
            totalQty: editingTool.totalQty,
            availableQty: editingTool.availableQty,
            status: editingTool.status,
        });

        toast.success("Tool updated successfully");
        setIsEditToolDialogOpen(false);
        setEditingTool(null);
    };

    const openDeleteToolDialog = (toolId: string) => {
        setDeletingToolId(toolId);
        setIsDeleteToolDialogOpen(true);
    };

    const handleDeleteTool = () => {
        removeTool(deletingToolId);
        toast.success("Tool deleted successfully");
        setIsDeleteToolDialogOpen(false);
        setDeletingToolId("");
    };

    const handleUpdateShiftTime = () => {
        updateInstructorShiftTime(INSTRUCTOR_ID, shiftEndTime);
        toast.success("Shift end time updated. Due dates have been recalculated.");
        setIsEditShiftDialogOpen(false);
    };

    // Stats for dashboard
    const stats = [
        {
            label: "Total Tools in Inventory",
            value: instructorTools.reduce((sum, t) => sum + t.totalQty, 0).toString(),
            icon: Wrench,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: "Available Tools",
            value: instructorTools.reduce((sum, t) => sum + t.availableQty, 0).toString(),
            icon: CheckCircle2,
            color: "text-green-600",
            bg: "bg-green-50",
        },
        {
            label: "Tools Currently Borrowed",
            value: borrowedTools.reduce((sum, t) => sum + t.quantity, 0).toString(),
            icon: Clock,
            color: "text-orange-600",
            bg: "bg-orange-50",
        },
        {
            label: "Pending Turnover",
            value: returnedTools.reduce((sum, t) => sum + t.quantity, 0).toString(),
            icon: RefreshCw,
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
    ];

    // Filtered tools for inventory
    const filteredTools = instructorTools.filter((tool) => {
        const matchesSearch =
            toolSearchQuery === "" ||
            tool.name.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
            tool.id.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
            tool.category.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
            tool.location.toLowerCase().includes(toolSearchQuery.toLowerCase());

        const matchesStatus = toolStatusFilter === "all" || tool.status === toolStatusFilter;
        const matchesCondition = toolConditionFilter === "all" || tool.condition === toolConditionFilter;

        return matchesSearch && matchesStatus && matchesCondition;
    });

    // Chart data for dashboard
    const categoryData = useMemo(() => {
        const categories = instructorTools.reduce((acc, tool) => {
            acc[tool.category] = (acc[tool.category] || 0) + tool.totalQty;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(categories).map(([name, value]) => ({ name, value }));
    }, [instructorTools]);

    // Weekly transaction stats for dashboard
    const weeklyTransactionStats = useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return {
                day: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                date: date.toDateString(),
            };
        });

        return last7Days.map(({ day, date }) => {
            const dayTransactions = instructorTransactions.filter((t) => {
                const tDate = new Date(t.borrowedAt).toDateString();
                return tDate === date;
            });

            const issued = dayTransactions
                .filter((t) => t.status === "borrowed" || t.status === "pending")
                .reduce((sum, t) => sum + t.quantity, 0);
            const returned = dayTransactions.filter((t) => t.status === "returned").reduce((sum, t) => sum + t.quantity, 0);
            const turnedOver = dayTransactions
                .filter((t) => t.status === "turned-over")
                .reduce((sum, t) => sum + t.quantity, 0);

            return { day, issued, returned, turnedOver };
        });
    }, [instructorTransactions]);

    const statusData = useMemo(() => {
        const available = instructorTools.reduce((sum, t) => sum + t.availableQty, 0);
        const borrowed = borrowedTools.reduce((sum, t) => sum + t.quantity, 0);
        const pendingTurnover = returnedTools.reduce((sum, t) => sum + t.quantity, 0);

        return [
            { name: "Available", value: available, color: "#10b981" },
            { name: "Borrowed", value: borrowed, color: "#f59e0b" },
            { name: "Pending Turnover", value: pendingTurnover, color: "#8b5cf6" },
        ];
    }, [instructorTools, borrowedTools, returnedTools]);

    const borrowingTrend = useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        });

        return last7Days.map((day, index) => ({
            day,
            borrowed: Math.floor(Math.random() * 10) + 5,
            returned: Math.floor(Math.random() * 8) + 3,
        }));
    }, []);

    const downloadReport = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Instructor Tool Management Report", 14, 20);
        doc.setFontSize(11);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
        doc.text(`Instructor: ${INSTRUCTOR_NAME}`, 14, 34);

        autoTable(doc, {
            startY: 40,
            head: [["Metric", "Value"]],
            body: stats.map((stat) => [stat.label, stat.value]),
        });

        const finalY = (doc as any).lastAutoTable.finalY || 40;

        autoTable(doc, {
            startY: finalY + 10,
            head: [["Transaction ID", "Tool", "Student", "Status", "Date"]],
            body: historyTransactions.slice(0, 20).map((t) => [t.id, t.toolName, t.studentName, t.action, t.date]),
        });

        doc.save("instructor-tool-report.pdf");
        toast.success("Report downloaded successfully");
    };

    const printReport = () => {
        window.print();
        toast.success("Print dialog opened");
    };

    const SidebarContent = () => (
        <>
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                        <Wrench className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="text-white">DPR DTMS</p>
                        <p className="text-blue-200 text-xs">Instructor Panel</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            setActiveTab(item.id);
                            setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                            activeTab === item.id
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/50"
                                : "text-blue-100 hover:bg-white/10"
                        }`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-blue-100 hover:bg-white/10 hover:text-white"
                    onClick={() => onNavigate("landing")}
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </Button>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex md:w-64 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 flex-col shadow-2xl">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetContent
                    side="left"
                    className="p-0 w-64 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 border-r-0"
                >
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <SheetDescription className="sr-only">Instructor panel navigation menu</SheetDescription>
                    <div className="flex flex-col h-full">
                        <SidebarContent />
                    </div>
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-4 md:p-8">
                    {/* Mobile Menu Button */}
                    <Button variant="ghost" size="icon" className="md:hidden mb-4" onClick={() => setMobileMenuOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </Button>

                    {/* Header */}
                    <div className="mb-6 md:mb-8">
                        <h1 className="text-2xl text-blue-900 mb-2">Instructor Panel</h1>
                        <p className="text-muted-foreground">
                            Welcome, {INSTRUCTOR_NAME}. Manage your tool inventory and student transactions.
                        </p>
                    </div>

                    {/* Dashboard Tab */}
                    {activeTab === "dashboard" && (
                        <div className="space-y-6">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {stats.map((stat, index) => (
                                    <Card
                                        key={index}
                                        className="bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-md hover:shadow-lg transition-shadow"
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                                                    <p className={`${stat.color}`}>{stat.value}</p>
                                                </div>
                                                <div
                                                    className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center shadow-sm`}
                                                >
                                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Quick Actions */}
                            <Card className="bg-gradient-to-br from-white to-blue-50/50 border-blue-100 shadow-md">
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                    <CardDescription>Common tasks for tool management</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button
                                        className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md"
                                        onClick={() => setActiveTab("issue")}
                                    >
                                        <PackagePlus className="w-4 h-4 mr-2" />
                                        Issue Tool to Student
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start border-blue-200 hover:bg-blue-50 hover:text-blue-900"
                                        onClick={() => setActiveTab("return")}
                                    >
                                        <PackageMinus className="w-4 h-4 mr-2" />
                                        Return Tool
                                    </Button>
                                    {returnedTools.length > 0 && (
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start border-purple-200 hover:bg-purple-50 hover:text-purple-900"
                                            onClick={() => setActiveTab("turnover")}
                                        >
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Turnover Tools ({returnedTools.length})
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Dashboard Charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200 shadow-md">
                                    <CardHeader>
                                        <CardTitle>Weekly Activity</CardTitle>
                                        <CardDescription>Tools issued vs returned vs turned over this week</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={weeklyTransactionStats}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="day" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="issued" fill="#f59e0b" name="Issued" />
                                                <Bar dataKey="returned" fill="#10b981" name="Returned" />
                                                <Bar dataKey="turnedOver" fill="#8b5cf6" name="Turned Over" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200 shadow-md">
                                    <CardHeader>
                                        <CardTitle>Distribution by Category</CardTitle>
                                        <CardDescription>Total tools in your inventory by category</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <PieChart>
                                                <Pie
                                                    data={categoryData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={(entry) => entry.name}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {categoryData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"][index % 4]}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Active Borrowings */}
                            <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200 shadow-md">
                                <CardHeader>
                                    <CardTitle>Currently Borrowed Tools</CardTitle>
                                    <CardDescription>Tools currently out with students</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Tool</TableHead>
                                                    <TableHead>Student</TableHead>
                                                    <TableHead>Qty</TableHead>
                                                    <TableHead>Borrowed</TableHead>
                                                    <TableHead>Due</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {borrowedTools.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                                            No tools currently borrowed
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    borrowedTools.map((tool) => (
                                                        <TableRow key={tool.transactionId}>
                                                            <TableCell>
                                                                <div className="flex items-center gap-3">
                                                                    <ImageWithFallback
                                                                        src={tool.image}
                                                                        alt={tool.toolName}
                                                                        className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                                                                    />
                                                                    <div>
                                                                        <p>{tool.toolName}</p>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {tool.toolId}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div>
                                                                    <p>{tool.studentName}</p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {tool.studentId}
                                                                    </p>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{tool.quantity}</TableCell>
                                                            <TableCell className="text-muted-foreground">
                                                                {tool.borrowedTime}
                                                            </TableCell>
                                                            <TableCell className="text-muted-foreground">
                                                                {tool.dueTime}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="border-green-200 text-green-700 hover:bg-green-50"
                                                                    onClick={() => handleReturnTool(tool.transactionId)}
                                                                >
                                                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                                                    Return
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Tool Inventory Tab */}
                    {activeTab === "inventory" && (
                        <div className="space-y-6">
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <h2 className="text-blue-900">My Tool Inventory</h2>
                                    <p className="text-muted-foreground">Manage your personal tool collection</p>
                                </div>
                                <Dialog open={isAddToolDialogOpen} onOpenChange={setIsAddToolDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add New Tool
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Add New Tool</DialogTitle>
                                            <DialogDescription>Add a tool to your inventory</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="tool-name">Tool Name *</Label>
                                                <Input
                                                    id="tool-name"
                                                    placeholder="e.g., Torque Wrench"
                                                    value={newToolData.name}
                                                    onChange={(e) =>
                                                        setNewToolData({ ...newToolData, name: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="tool-category">Category *</Label>
                                                <Select
                                                    value={newToolData.category}
                                                    onValueChange={(value) =>
                                                        setNewToolData({ ...newToolData, category: value })
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Hand Tools">Hand Tools</SelectItem>
                                                        <SelectItem value="Power Tools">Power Tools</SelectItem>
                                                        <SelectItem value="Measuring Tools">Measuring Tools</SelectItem>
                                                        <SelectItem value="Testing Equipment">Testing Equipment</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="tool-location">Location *</Label>
                                                <Input
                                                    id="tool-location"
                                                    placeholder="e.g., Cabinet A1"
                                                    value={newToolData.location}
                                                    onChange={(e) =>
                                                        setNewToolData({ ...newToolData, location: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="tool-total-qty">Total Qty *</Label>
                                                    <Input
                                                        id="tool-total-qty"
                                                        type="number"
                                                        min="1"
                                                        value={newToolData.totalQty}
                                                        onChange={(e) => {
                                                            const val = parseInt(e.target.value) || 1;
                                                            setNewToolData({
                                                                ...newToolData,
                                                                totalQty: val,
                                                                availableQty: val,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="tool-condition">Condition</Label>
                                                    <Select
                                                        value={newToolData.condition}
                                                        onValueChange={(value: any) =>
                                                            setNewToolData({ ...newToolData, condition: value })
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="good">Good</SelectItem>
                                                            <SelectItem value="fair">Fair</SelectItem>
                                                            <SelectItem value="needs-repair">Needs Repair</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() => {
                                                    setIsAddToolDialogOpen(false);
                                                    setNewToolData({
                                                        name: "",
                                                        category: "",
                                                        location: "",
                                                        condition: "good",
                                                        image: "",
                                                        totalQty: 1,
                                                        availableQty: 1,
                                                        status: "available",
                                                    });
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                                                onClick={handleAddTool}
                                            >
                                                Add Tool
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200 shadow-md">
                                <CardHeader>
                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <CardTitle>Inventory List</CardTitle>
                                            <CardDescription>All tools in your inventory</CardDescription>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search tools..."
                                                    className="pl-9 w-full md:w-64"
                                                    value={toolSearchQuery}
                                                    onChange={(e) => setToolSearchQuery(e.target.value)}
                                                />
                                            </div>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" size="icon">
                                                        <Filter className="w-4 h-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-64">
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label>Status</Label>
                                                            <Select
                                                                value={toolStatusFilter}
                                                                onValueChange={setToolStatusFilter}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="All status" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="all">All Status</SelectItem>
                                                                    <SelectItem value="available">Available</SelectItem>
                                                                    <SelectItem value="unavailable">Unavailable</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Condition</Label>
                                                            <Select
                                                                value={toolConditionFilter}
                                                                onValueChange={setToolConditionFilter}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="All conditions" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="all">All Conditions</SelectItem>
                                                                    <SelectItem value="good">Good</SelectItem>
                                                                    <SelectItem value="fair">Fair</SelectItem>
                                                                    <SelectItem value="needs-repair">
                                                                        Needs Repair
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Tool ID</TableHead>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Category</TableHead>
                                                    <TableHead>Location</TableHead>
                                                    <TableHead>Total Qty</TableHead>
                                                    <TableHead>Available Qty</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Condition</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredTools.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={9} className="text-center text-muted-foreground">
                                                            {instructorTools.length === 0
                                                                ? "No tools in inventory. Add your first tool to get started."
                                                                : "No tools match your search criteria."}
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    filteredTools.map((tool) => (
                                                        <TableRow key={tool.id}>
                                                            <TableCell>{tool.id}</TableCell>
                                                            <TableCell>{tool.name}</TableCell>
                                                            <TableCell>{tool.category}</TableCell>
                                                            <TableCell className="text-slate-600">{tool.location}</TableCell>
                                                            <TableCell>{tool.totalQty}</TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={
                                                                        tool.availableQty > 0
                                                                            ? "bg-green-50 text-green-700 border-green-200"
                                                                            : "bg-red-50 text-red-700 border-red-200"
                                                                    }
                                                                >
                                                                    {tool.availableQty}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={
                                                                        tool.status === "available"
                                                                            ? "bg-green-50 text-green-700 border-green-200"
                                                                            : "bg-gray-50 text-gray-700 border-gray-200"
                                                                    }
                                                                >
                                                                    {tool.status}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={
                                                                        tool.condition === "good"
                                                                            ? "bg-green-50 text-green-700 border-green-200"
                                                                            : tool.condition === "fair"
                                                                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                                            : "bg-red-50 text-red-700 border-red-200"
                                                                    }
                                                                >
                                                                    {tool.condition}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="hover:bg-amber-50 hover:text-amber-700"
                                                                        onClick={() => openEditToolDialog(tool)}
                                                                    >
                                                                        <Edit className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="hover:bg-red-50 hover:text-red-700"
                                                                        onClick={() => openDeleteToolDialog(tool.id)}
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Issue Tool Tab */}
                    {activeTab === "issue" && (
                        <div className="space-y-6">
                            {/* Shift Time Configuration */}
                            <Card className="bg-gradient-to-br from-white to-amber-50/50 border-amber-100 shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-amber-600" />
                                        Shift Configuration
                                    </CardTitle>
                                    <CardDescription>
                                        Set your shift end time - this determines when borrowed tools are due
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
                                        <div className="flex-1 w-full space-y-2">
                                            <Label htmlFor="shift-time">Shift End Time</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    id="shift-time"
                                                    type="time"
                                                    value={shiftEndTime}
                                                    onChange={(e) => setShiftEndTime(e.target.value)}
                                                    className="max-w-xs"
                                                />
                                                <Dialog open={isEditShiftDialogOpen} onOpenChange={setIsEditShiftDialogOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="border-amber-200 text-amber-700 hover:bg-amber-50"
                                                        >
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Update
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Update Shift End Time</DialogTitle>
                                                            <DialogDescription>
                                                                Changing your shift end time will update the due times for
                                                                all currently borrowed and returned tools.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="py-4">
                                                            <p className="text-sm text-muted-foreground">
                                                                New shift end time:{" "}
                                                                <span className="font-semibold text-foreground">
                                                                    {shiftEndTime}
                                                                </span>
                                                            </p>
                                                            <p className="text-sm text-muted-foreground mt-2">
                                                                All active tool due times will be recalculated based on this
                                                                new time.
                                                            </p>
                                                        </div>
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => setIsEditShiftDialogOpen(false)}
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                onClick={handleUpdateShiftTime}
                                                                className="bg-amber-600 hover:bg-amber-700"
                                                            >
                                                                Confirm Update
                                                            </Button>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Current setting: Tools must be returned by{" "}
                                                <span className="font-semibold text-amber-700">{shiftEndTime}</span> on the
                                                day they are borrowed
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-white to-blue-50/50 border-blue-100 shadow-md">
                                <CardHeader>
                                    <CardTitle>Select Tools to Issue</CardTitle>
                                    <CardDescription>Choose tools from your inventory to issue to students</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {instructorTools.filter((t) => t.availableQty > 0).length === 0 ? (
                                            <p className="text-center text-muted-foreground py-8">
                                                No tools available in your inventory. All tools are currently borrowed.
                                            </p>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {instructorTools
                                                    .filter((t) => t.availableQty > 0)
                                                    .map((tool) => (
                                                        <div
                                                            key={tool.id}
                                                            className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                                                                selectedTools.includes(tool.id)
                                                                    ? "border-blue-500 bg-blue-50"
                                                                    : "border-slate-200 hover:border-blue-300 bg-white"
                                                            }`}
                                                            onClick={() => toggleToolSelection(tool.id)}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <ImageWithFallback
                                                                    src={tool.image}
                                                                    alt={tool.name}
                                                                    className="w-16 h-16 rounded-lg object-cover border border-slate-200"
                                                                />
                                                                <div className="flex-1">
                                                                    <p>{tool.name}</p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {tool.id}
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground mt-1">
                                                                        {tool.location}
                                                                    </p>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="mt-2 bg-green-50 text-green-700 border-green-200 text-xs"
                                                                    >
                                                                        Available: {tool.availableQty}
                                                                    </Badge>
                                                                    {selectedTools.includes(tool.id) && (
                                                                        <div
                                                                            className="mt-2"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            <Label className="text-xs">Quantity:</Label>
                                                                            <div className="flex items-center gap-2 mt-1">
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="outline"
                                                                                    className="h-6 w-6 p-0"
                                                                                    onClick={() =>
                                                                                        updateQuantity(
                                                                                            tool.id,
                                                                                            (selectedQuantities[tool.id] ||
                                                                                                1) - 1
                                                                                        )
                                                                                    }
                                                                                    disabled={
                                                                                        (selectedQuantities[tool.id] || 1) <=
                                                                                        1
                                                                                    }
                                                                                >
                                                                                    -
                                                                                </Button>
                                                                                <span className="text-sm w-8 text-center">
                                                                                    {selectedQuantities[tool.id] || 1}
                                                                                </span>
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="outline"
                                                                                    className="h-6 w-6 p-0"
                                                                                    onClick={() =>
                                                                                        updateQuantity(
                                                                                            tool.id,
                                                                                            (selectedQuantities[tool.id] ||
                                                                                                1) + 1
                                                                                        )
                                                                                    }
                                                                                    disabled={
                                                                                        (selectedQuantities[tool.id] || 1) >=
                                                                                        tool.availableQty
                                                                                    }
                                                                                >
                                                                                    +
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {selectedTools.length > 0 && (
                                <Card className="bg-gradient-to-br from-white to-green-50/50 border-green-100 shadow-md">
                                    <CardHeader>
                                        <CardTitle>Selected Tools Summary</CardTitle>
                                        <CardDescription>
                                            {selectedTools.length} tool(s) selected for issuance
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {selectedTools.map((toolId) => {
                                                const tool = instructorTools.find((t) => t.id === toolId);
                                                if (!tool) return null;
                                                return (
                                                    <div
                                                        key={toolId}
                                                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <ImageWithFallback
                                                                src={tool.image}
                                                                alt={tool.name}
                                                                className="w-10 h-10 rounded-lg object-cover"
                                                            />
                                                            <div>
                                                                <p>{tool.name}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Qty: {selectedQuantities[toolId] || 1}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => toggleToolSelection(toolId)}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <Button
                                            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md"
                                            onClick={handleIssueTools}
                                        >
                                            <QrCode className="w-4 h-4 mr-2" />
                                            Generate QR Code for Student
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}

                    {/* Return Tool Tab */}
                    {activeTab === "return" && (
                        <div className="space-y-6">
                            <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200 shadow-md">
                                <CardHeader>
                                    <CardTitle>Borrowed Tools</CardTitle>
                                    <CardDescription>Mark tools as returned when students bring them back</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Tool</TableHead>
                                                    <TableHead>Student</TableHead>
                                                    <TableHead>Section</TableHead>
                                                    <TableHead>Qty</TableHead>
                                                    <TableHead>Borrowed</TableHead>
                                                    <TableHead>Due</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {borrowedTools.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                                                            No tools currently borrowed
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    borrowedTools.map((tool) => (
                                                        <TableRow key={tool.transactionId}>
                                                            <TableCell>
                                                                <div className="flex items-center gap-3">
                                                                    <ImageWithFallback
                                                                        src={tool.image}
                                                                        alt={tool.toolName}
                                                                        className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                                                                    />
                                                                    <div>
                                                                        <p>{tool.toolName}</p>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {tool.toolId}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div>
                                                                    <p>{tool.studentName}</p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {tool.studentId}
                                                                    </p>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{tool.section}</TableCell>
                                                            <TableCell>{tool.quantity}</TableCell>
                                                            <TableCell className="text-muted-foreground">
                                                                {tool.borrowedTime}
                                                            </TableCell>
                                                            <TableCell className="text-muted-foreground">
                                                                {tool.dueTime}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                                                                    onClick={() => handleReturnTool(tool.transactionId)}
                                                                >
                                                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                                                    Mark Returned
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Turnover Tool Tab */}
                    {activeTab === "turnover" && (
                        <div className="space-y-6">
                            <Card className="bg-gradient-to-br from-white to-purple-50/50 border-purple-100 shadow-md">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Returned Tools Ready for Turnover</CardTitle>
                                            <CardDescription>Mark these tools as turned over to admin</CardDescription>
                                        </div>
                                        {returnedTools.length > 0 && (
                                            <Button
                                                className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
                                                onClick={handleTurnoverAll}
                                            >
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                Mark All as Turned Over
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Tool</TableHead>
                                                    <TableHead>Student</TableHead>
                                                    <TableHead>Qty</TableHead>
                                                    <TableHead>Borrowed</TableHead>
                                                    <TableHead>Returned</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {returnedTools.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                                            No tools ready for turnover
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    returnedTools.map((transaction) => {
                                                        const tool = instructorTools.find(
                                                            (t) => t.id === transaction.toolId
                                                        );
                                                        return (
                                                            <TableRow key={transaction.id}>
                                                                <TableCell>
                                                                    <div className="flex items-center gap-3">
                                                                        <ImageWithFallback
                                                                            src={
                                                                                tool?.image ||
                                                                                "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400"
                                                                            }
                                                                            alt={transaction.toolName}
                                                                            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                                                                        />
                                                                        <div>
                                                                            <p>{transaction.toolName}</p>
                                                                            <p className="text-xs text-muted-foreground">
                                                                                {transaction.toolId}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div>
                                                                        <p>{transaction.studentName}</p>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {transaction.studentId}
                                                                        </p>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>{transaction.quantity}</TableCell>
                                                                <TableCell className="text-muted-foreground">
                                                                    {new Date(transaction.borrowedAt).toLocaleTimeString()}
                                                                </TableCell>
                                                                <TableCell className="text-muted-foreground">
                                                                    {transaction.returnedAt
                                                                        ? new Date(
                                                                              transaction.returnedAt
                                                                          ).toLocaleTimeString()
                                                                        : "N/A"}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Button
                                                                        size="sm"
                                                                        className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
                                                                        onClick={() => handleTurnoverTool(transaction.id)}
                                                                    >
                                                                        <CheckCircle2 className="w-4 h-4 mr-1" />
                                                                        Mark Turned Over
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* History Tab */}
                    {activeTab === "history" && (
                        <div className="space-y-6">
                            <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200 shadow-md">
                                <CardHeader>
                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <CardTitle>Transaction History</CardTitle>
                                            <CardDescription>Complete record of all tool transactions</CardDescription>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search transactions..."
                                                    className="pl-9 w-full md:w-64"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" size="icon">
                                                        <Filter className="w-4 h-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-64">
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label>Date Range</Label>
                                                            <Select value={dateFilter} onValueChange={setDateFilter}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="All dates" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="all">All Time</SelectItem>
                                                                    <SelectItem value="today">Today</SelectItem>
                                                                    <SelectItem value="week">This Week</SelectItem>
                                                                    <SelectItem value="month">This Month</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Section</Label>
                                                            <Select value={sectionFilter} onValueChange={setSectionFilter}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="All sections" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="all">All Sections</SelectItem>
                                                                    <SelectItem value="AMT-1A">AMT-1A</SelectItem>
                                                                    <SelectItem value="AMT-1B">AMT-1B</SelectItem>
                                                                    <SelectItem value="AMT-2A">AMT-2A</SelectItem>
                                                                    <SelectItem value="AMT-2B">AMT-2B</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Transaction ID</TableHead>
                                                    <TableHead>Tool</TableHead>
                                                    <TableHead>Student</TableHead>
                                                    <TableHead>Section</TableHead>
                                                    <TableHead>Qty</TableHead>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Time</TableHead>
                                                    <TableHead>Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredHistory.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                                                            No transactions found
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    filteredHistory.map((transaction) => (
                                                        <TableRow key={transaction.id}>
                                                            <TableCell>{transaction.id}</TableCell>
                                                            <TableCell>
                                                                <div>
                                                                    <p>{transaction.toolName}</p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {transaction.toolId}
                                                                    </p>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div>
                                                                    <p>{transaction.studentName}</p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {transaction.studentId}
                                                                    </p>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{transaction.section}</TableCell>
                                                            <TableCell>{transaction.quantity}</TableCell>
                                                            <TableCell className="text-muted-foreground">
                                                                {transaction.date}
                                                            </TableCell>
                                                            <TableCell className="text-muted-foreground">
                                                                {transaction.time}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={
                                                                        transaction.status === "borrowed"
                                                                            ? "bg-orange-50 text-orange-700 border-orange-200"
                                                                            : transaction.status === "returned"
                                                                            ? "bg-green-50 text-green-700 border-green-200"
                                                                            : transaction.status === "turned-over"
                                                                            ? "bg-purple-50 text-purple-700 border-purple-200"
                                                                            : "bg-gray-50 text-gray-700 border-gray-200"
                                                                    }
                                                                >
                                                                    {transaction.action}
                                                                </Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Reports Tab */}
                    {activeTab === "reports" && (
                        <div className="space-y-6">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="text-blue-900">Reports & Analytics</h2>
                                    <p className="text-muted-foreground">Insights into your tool management</p>
                                </div>
                                <div className="flex gap-2">
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

                            {/* Stats Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {stats.map((stat, index) => (
                                    <Card
                                        key={index}
                                        className="bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-md"
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                                                    <p className={`${stat.color}`}>{stat.value}</p>
                                                </div>
                                                <div
                                                    className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center shadow-sm`}
                                                >
                                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {categoryData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"][index % 4]}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

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
                                            <Line type="monotone" dataKey="borrowed" stroke="#f59e0b" strokeWidth={2} />
                                            <Line type="monotone" dataKey="returned" stroke="#10b981" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </main>

            {/* QR Code Dialog */}
            <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>QR Code Generated</DialogTitle>
                        <DialogDescription>
                            Show this QR code to the student to complete the borrowing process
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 py-4">
                        <div className="w-64 h-64 bg-white border-4 border-blue-500 rounded-lg flex items-center justify-center">
                            <QrCode className="w-32 h-32 text-blue-500" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Transaction ID</p>
                            <p className="text-blue-900 font-mono">{generatedTransactionId}</p>
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                            Student can scan this code or manually enter the transaction ID
                        </p>
                        <div className="flex gap-2 w-full">
                            <Button variant="outline" className="flex-1" onClick={() => toast.success("QR Code downloaded")}>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>
                            <Button variant="outline" className="flex-1" onClick={() => toast.success("QR Code printed")}>
                                <Printer className="w-4 h-4 mr-2" />
                                Print
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Tool Dialog */}
            <Dialog open={isEditToolDialogOpen} onOpenChange={setIsEditToolDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Tool</DialogTitle>
                        <DialogDescription>Update tool information</DialogDescription>
                    </DialogHeader>
                    {editingTool && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-tool-name">Tool Name *</Label>
                                <Input
                                    id="edit-tool-name"
                                    value={editingTool.name}
                                    onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-tool-category">Category *</Label>
                                <Select
                                    value={editingTool.category}
                                    onValueChange={(value) => setEditingTool({ ...editingTool, category: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Hand Tools">Hand Tools</SelectItem>
                                        <SelectItem value="Power Tools">Power Tools</SelectItem>
                                        <SelectItem value="Measuring Tools">Measuring Tools</SelectItem>
                                        <SelectItem value="Testing Equipment">Testing Equipment</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-tool-location">Location *</Label>
                                <Input
                                    id="edit-tool-location"
                                    value={editingTool.location}
                                    onChange={(e) => setEditingTool({ ...editingTool, location: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-tool-total-qty">Total Qty *</Label>
                                    <Input
                                        id="edit-tool-total-qty"
                                        type="number"
                                        min="1"
                                        value={editingTool.totalQty}
                                        onChange={(e) =>
                                            setEditingTool({ ...editingTool, totalQty: parseInt(e.target.value) || 1 })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-tool-available-qty">Available Qty *</Label>
                                    <Input
                                        id="edit-tool-available-qty"
                                        type="number"
                                        min="0"
                                        max={editingTool.totalQty}
                                        value={editingTool.availableQty}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value) || 0;
                                            if (val <= editingTool.totalQty) {
                                                setEditingTool({ ...editingTool, availableQty: val });
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-tool-status">Status</Label>
                                    <Select
                                        value={editingTool.status}
                                        onValueChange={(value: any) => setEditingTool({ ...editingTool, status: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="available">Available</SelectItem>
                                            <SelectItem value="unavailable">Unavailable</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-tool-condition">Condition</Label>
                                    <Select
                                        value={editingTool.condition}
                                        onValueChange={(value: any) => setEditingTool({ ...editingTool, condition: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="good">Good</SelectItem>
                                            <SelectItem value="fair">Fair</SelectItem>
                                            <SelectItem value="needs-repair">Needs Repair</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                                setIsEditToolDialogOpen(false);
                                setEditingTool(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                            onClick={handleEditTool}
                        >
                            Save Changes
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Tool Dialog */}
            <AlertDialog open={isDeleteToolDialogOpen} onOpenChange={setIsDeleteToolDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Tool</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this tool? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteTool}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
