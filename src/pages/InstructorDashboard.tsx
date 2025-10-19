import { useState, useMemo } from "react";
import { DashboardSidebar, NavItem } from "../components/layout/DashboardSidebar";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { StatsCard } from "../components/dashboard/StatsCard";
import { SearchBar } from "../components/dashboard/SearchBar";
import { FilterBar } from "../components/dashboard/FilterBar";
import { ToolInventoryGrid } from "../components/instructor/ToolInventoryGrid";
import { ToolFormDialog } from "../components/instructor/ToolFormDialog";
import { QRCodeGenerator } from "../components/instructor/QRCodeGenerator";
import { InstructorReportsTab } from "../components/instructor/InstructorReportsTab";
import { StudentToolsGroup, GroupedStudent } from "../components/instructor/StudentToolsGroup";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Badge } from "../components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import {
    LayoutDashboard,
    PackagePlus,
    PackageMinus,
    History,
    FileText,
    Package,
    RefreshCw,
    CheckCircle2,
    Clock,
    Plus,
    Filter,
} from "lucide-react";
import { useToolManagement } from "../hooks/useToolManagement";
import { useTransactions } from "../hooks/useTransactions";
import { useAppContext } from "../contexts/AppContext";
import { toast } from "sonner";
import {
    BarChart,
    Bar,
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

interface InstructorDashboardProps {
    onNavigate: (page: string) => void;
}

const INSTRUCTOR_ID = "I-001";
const INSTRUCTOR_NAME = "Prof. Richard Anderson";

export function InstructorDashboard({ onNavigate }: InstructorDashboardProps) {
    const { getReturnedToolsByInstructor, createPendingTransaction, markToolAsTurnedOver, markAllAsTurnedOver } =
        useAppContext();

    const [activeTab, setActiveTab] = useState("dashboard");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Tool Management
    const {
        filteredTools,
        toolSearchQuery,
        setToolSearchQuery,
        toolStatusFilter,
        setToolStatusFilter,
        toolConditionFilter,
        setToolConditionFilter,
        handleAddTool,
        handleUpdateTool,
        handleDeleteTool,
    } = useToolManagement(INSTRUCTOR_ID);

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
        status: "available" as "available" | "unavailable",
        totalQty: 1,
        availableQty: 1,
        image: "",
    });

    // Transaction Management
    const {
        transactions: instructorTransactions,
        filteredTransactions,
        searchQuery,
        setSearchQuery,
        dateFilter,
        setDateFilter,
        sectionFilter,
        setSectionFilter,
        handleCreateTransaction,
        handleReturnTool,
        handleTurnoverTool,
        handleTurnoverAll,
    } = useTransactions(INSTRUCTOR_ID);

    // Issue Tool State
    const [selectedTools, setSelectedTools] = useState<string[]>([]);
    const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
    const [showQRDialog, setShowQRDialog] = useState(false);
    const [generatedTransactionId, setGeneratedTransactionId] = useState("");

    // Get borrowed tools
    const borrowedTools = useMemo(() => {
        return instructorTransactions
            .filter((t) => t.status === "borrowed")
            .map((t) => {
                const tool = filteredTools.find((tool) => tool.id === t.toolId);
                return {
                    toolId: t.toolId,
                    toolName: t.toolName,
                    studentName: t.studentName,
                    studentId: t.studentId,
                    section: t.section,
                    borrowedTime: new Date(t.borrowedAt).toLocaleTimeString(),
                    dueTime: new Date(t.dueDate || t.borrowedAt).toLocaleTimeString(),
                    image: tool?.image || "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400",
                    transactionId: t.id,
                    quantity: t.quantity,
                };
            });
    }, [instructorTransactions, filteredTools]);

    const returnedTools = getReturnedToolsByInstructor(INSTRUCTOR_ID);

    // Group borrowed tools by student
    const groupedBorrowedStudents = useMemo((): GroupedStudent[] => {
        const studentMap = new Map<string, GroupedStudent>();

        borrowedTools.forEach((tool) => {
            if (!studentMap.has(tool.studentId)) {
                studentMap.set(tool.studentId, {
                    studentId: tool.studentId,
                    studentName: tool.studentName,
                    section: tool.section,
                    tools: [],
                    totalTools: 0,
                });
            }

            const student = studentMap.get(tool.studentId)!;
            student.tools.push({
                transactionId: tool.transactionId,
                toolId: tool.toolId,
                toolName: tool.toolName,
                borrowedTime: tool.borrowedTime,
                dueTime: tool.dueTime,
                quantity: tool.quantity,
                image: tool.image,
            });
            student.totalTools += 1;
        });

        return Array.from(studentMap.values());
    }, [borrowedTools]);

    // Group returned tools by student
    const groupedReturnedStudents = useMemo((): GroupedStudent[] => {
        const studentMap = new Map<string, GroupedStudent>();

        returnedTools.forEach((tool) => {
            if (!studentMap.has(tool.studentId)) {
                studentMap.set(tool.studentId, {
                    studentId: tool.studentId,
                    studentName: tool.studentName,
                    section: tool.section || "N/A",
                    tools: [],
                    totalTools: 0,
                });
            }

            const student = studentMap.get(tool.studentId)!;
            const foundTool = filteredTools.find((t) => t.id === tool.toolId);
            student.tools.push({
                transactionId: tool.id,
                toolId: tool.toolId,
                toolName: tool.toolName,
                returnedAt: tool.returnedAt,
                quantity: tool.quantity || 1,
                image: foundTool?.image || "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400",
            });
            student.totalTools += 1;
        });

        return Array.from(studentMap.values());
    }, [returnedTools, filteredTools]);

    // Statistics
    const stats = [
        {
            label: "Total Tools",
            value: filteredTools.length.toString(),
            icon: Package,
            color: "text-blue-700",
            bg: "bg-blue-100",
        },
        {
            label: "Available",
            value: filteredTools.filter((t) => t.status === "available").length.toString(),
            icon: CheckCircle2,
            color: "text-green-700",
            bg: "bg-green-100",
        },
        {
            label: "Currently Borrowed",
            value: borrowedTools.length.toString(),
            icon: Clock,
            color: "text-amber-700",
            bg: "bg-amber-100",
        },
        {
            label: "Ready for Turnover",
            value: returnedTools.length.toString(),
            icon: RefreshCw,
            color: "text-purple-700",
            bg: "bg-purple-100",
        },
    ];

    const navItems: NavItem[] = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "inventory", label: "Tool Inventory", icon: Package },
        { id: "issue", label: "Issue Tool", icon: PackagePlus },
        { id: "return", label: "Return Tool", icon: PackageMinus },
        { id: "turnover", label: "Turnover Tool", icon: RefreshCw },
        { id: "history", label: "History", icon: History },
        { id: "reports", label: "Reports", icon: FileText },
    ];

    // Tool Handlers
    const handleToolAdd = () => {
        if (handleAddTool({ ...newToolData, instructorName: INSTRUCTOR_NAME })) {
            setIsAddToolDialogOpen(false);
            setNewToolData({
                name: "",
                category: "",
                location: "",
                condition: "good",
                status: "available",
                totalQty: 1,
                availableQty: 1,
                image: "",
            });
        }
    };

    const handleToolUpdate = () => {
        if (editingTool && handleUpdateTool(editingTool.id, editingTool)) {
            setIsEditToolDialogOpen(false);
            setEditingTool(null);
        }
    };

    const handleToolDelete = () => {
        const tool = filteredTools.find((t) => t.id === deletingToolId);
        if (tool) {
            handleDeleteTool(deletingToolId, tool.name);
            setIsDeleteToolDialogOpen(false);
            setDeletingToolId("");
        }
    };

    // Issue Tool Handler
    const handleIssueTools = () => {
        if (selectedTools.length === 0) {
            toast.error("Please select at least one tool");
            return;
        }

        const firstToolId = selectedTools[0];
        const quantity = selectedQuantities[firstToolId] || 1;
        const transactionId = createPendingTransaction(firstToolId, INSTRUCTOR_NAME, INSTRUCTOR_ID, quantity);

        if (transactionId) {
            setGeneratedTransactionId(transactionId);
            setShowQRDialog(true);
            setSelectedTools([]);
            setSelectedQuantities({});
        }
    };

    const toggleToolSelection = (toolId: string) => {
        setSelectedTools((prev) => (prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]));
    };

    // Bulk action handlers for grouped students
    const handleReturnAllForStudent = (studentId: string, transactionIds: string[]) => {
        transactionIds.forEach((id) => handleReturnTool(id));
        toast.success(`All tools returned for student`);
    };

    const handleTurnoverAllForStudent = (studentId: string, transactionIds: string[]) => {
        transactionIds.forEach((id) => handleTurnoverTool(id));
        toast.success(`All tools turned over for student`);
    };

    // Chart Data for Dashboard
    const categoryData = useMemo(() => {
        const categories = new Map<string, number>();
        filteredTools.forEach((tool) => {
            categories.set(tool.category, (categories.get(tool.category) || 0) + tool.totalQty);
        });
        return Array.from(categories.entries()).map(([name, value]) => ({ name, value }));
    }, [filteredTools]);

    // Weekly Activity Data (Last 7 Days)
    const weeklyActivityData = useMemo(() => {
        const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const today = new Date();
        const currentDayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // Calculate start of the week (Monday)
        const startOfWeek = new Date(today);
        const daysToMonday = currentDayIndex === 0 ? 6 : currentDayIndex - 1;
        startOfWeek.setDate(today.getDate() - daysToMonday);
        startOfWeek.setHours(0, 0, 0, 0);

        return daysOfWeek.map((day, index) => {
            const checkDate = new Date(startOfWeek);
            checkDate.setDate(startOfWeek.getDate() + index);

            const dayTransactions = instructorTransactions.filter((t) => {
                const tDate = new Date(t.borrowedAt);
                return tDate.toDateString() === checkDate.toDateString();
            });

            const borrowed = dayTransactions.filter(
                (t) => t.status === "borrowed" || t.status === "returned" || t.status === "turned-over"
            ).length;
            const returned = dayTransactions.filter((t) => t.status === "returned" || t.status === "turned-over").length;

            return {
                day,
                Borrowed: borrowed,
                Returned: returned,
            };
        });
    }, [instructorTransactions]);

    const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

    return (
        <div className="flex h-screen bg-slate-50">
            <DashboardSidebar
                navItems={navItems}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onLogout={() => onNavigate("landing")}
                title="DPR DTMS"
                subtitle="Instructor Panel"
                mobileMenuOpen={mobileMenuOpen}
                onMobileMenuChange={setMobileMenuOpen}
            />

            <DashboardLayout
                title="Instructor Panel"
                description={`Welcome, ${INSTRUCTOR_NAME}. Manage your tool inventory and student transactions.`}
                onMobileMenuToggle={() => setMobileMenuOpen(true)}
            >
                {/* Dashboard Tab */}
                {activeTab === "dashboard" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <StatsCard key={index} {...stat} />
                            ))}
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>Common tasks for tool management</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-500"
                                    onClick={() => setActiveTab("issue")}
                                >
                                    <PackagePlus className="w-4 h-4 mr-2" />
                                    Issue Tool to Student
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => setActiveTab("return")}
                                >
                                    <PackageMinus className="w-4 h-4 mr-2" />
                                    Return Tool
                                </Button>
                                {returnedTools.length > 0 && (
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => setActiveTab("turnover")}
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Turnover Tools ({returnedTools.length})
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Distribution by Category</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label
                                            >
                                                {categoryData.map((_, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Currently Borrowed Tools</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {borrowedTools.length === 0 ? (
                                        <p className="text-muted-foreground text-center py-8">No tools currently borrowed</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {borrowedTools.slice(0, 5).map((tool) => (
                                                <div
                                                    key={tool.transactionId}
                                                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                                                >
                                                    <div>
                                                        <p className="text-sm">{tool.toolName}</p>
                                                        <p className="text-xs text-muted-foreground">{tool.studentName}</p>
                                                    </div>
                                                    <Badge variant="outline" className="bg-amber-50">
                                                        {tool.section}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Weekly Activity Chart */}
                        <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200 shadow-md">
                            <CardHeader>
                                <CardTitle>Weekly Activity</CardTitle>
                                <CardDescription>Tool borrowing and return activity for this week</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={weeklyActivityData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="Borrowed" fill="#f59e0b" />
                                        <Bar dataKey="Returned" fill="#10b981" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Tool Inventory Tab */}
                {activeTab === "inventory" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <SearchBar
                                value={toolSearchQuery}
                                onChange={setToolSearchQuery}
                                placeholder="Search tools by name, category, or location..."
                                className="flex-1 max-w-md"
                            />
                            <div className="flex items-center gap-3">
                                <FilterBar
                                    filters={[
                                        {
                                            value: toolStatusFilter,
                                            onChange: setToolStatusFilter,
                                            options: [
                                                { value: "all", label: "All Status" },
                                                { value: "available", label: "Available" },
                                                { value: "unavailable", label: "Unavailable" },
                                            ],
                                            placeholder: "Status",
                                        },
                                        {
                                            value: toolConditionFilter,
                                            onChange: setToolConditionFilter,
                                            options: [
                                                { value: "all", label: "All Conditions" },
                                                { value: "good", label: "Good" },
                                                { value: "fair", label: "Fair" },
                                                { value: "needs-repair", label: "Needs Repair" },
                                            ],
                                            placeholder: "Condition",
                                        },
                                    ]}
                                    onReset={() => {
                                        setToolStatusFilter("all");
                                        setToolConditionFilter("all");
                                    }}
                                />
                                <Button onClick={() => setIsAddToolDialogOpen(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Tool
                                </Button>
                            </div>
                        </div>

                        <ToolInventoryGrid
                            tools={filteredTools}
                            onEdit={(tool) => {
                                setEditingTool(tool);
                                setIsEditToolDialogOpen(true);
                            }}
                            onDelete={(tool) => {
                                setDeletingToolId(tool.id);
                                setIsDeleteToolDialogOpen(true);
                            }}
                        />
                    </div>
                )}

                {/* Issue Tool Tab */}
                {activeTab === "issue" && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Issue Tool to Student</CardTitle>
                                <CardDescription>
                                    Select tools to issue and generate QR code for student scanning
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    {filteredTools
                                        .filter((t) => t.status === "available" && t.availableQty > 0)
                                        .map((tool) => (
                                            <div
                                                key={tool.id}
                                                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTools.includes(tool.id)}
                                                    onChange={() => toggleToolSelection(tool.id)}
                                                    className="w-4 h-4"
                                                />
                                                <div className="flex-1">
                                                    <p>{tool.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {tool.category} - {tool.location}
                                                    </p>
                                                </div>
                                                <Badge>{tool.availableQty} available</Badge>
                                                {selectedTools.includes(tool.id) && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-muted-foreground">Qty:</span>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            max={tool.availableQty}
                                                            value={selectedQuantities[tool.id] || 1}
                                                            onChange={(e) => {
                                                                const value = parseInt(e.target.value) || 1;
                                                                const clampedValue = Math.max(
                                                                    1,
                                                                    Math.min(value, tool.availableQty)
                                                                );
                                                                setSelectedQuantities({
                                                                    ...selectedQuantities,
                                                                    [tool.id]: clampedValue,
                                                                });
                                                            }}
                                                            className="w-20"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                </div>

                                <Button onClick={handleIssueTools} className="w-full" disabled={selectedTools.length === 0}>
                                    Generate QR Code
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Return Tool Tab */}
                {activeTab === "return" && (
                    <Card className="bg-white border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle>Return Tools</CardTitle>
                            <CardDescription>
                                Students with borrowed tools - expand to view and return individual tools
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <StudentToolsGroup
                                students={groupedBorrowedStudents}
                                mode="return"
                                onActionSingle={handleReturnTool}
                                onActionAll={handleReturnAllForStudent}
                                emptyMessage="No tools currently borrowed"
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Turnover Tab */}
                {activeTab === "turnover" && (
                    <Card className="bg-white border-slate-200 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Turnover Tools to Admin</CardTitle>
                                    <CardDescription>
                                        Students with returned tools - expand to view and turnover individual tools
                                    </CardDescription>
                                </div>
                                {returnedTools.length > 0 && (
                                    <Button onClick={() => handleTurnoverAll(INSTRUCTOR_ID)}>
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Turnover All Students
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <StudentToolsGroup
                                students={groupedReturnedStudents}
                                mode="turnover"
                                onActionSingle={handleTurnoverTool}
                                onActionAll={handleTurnoverAllForStudent}
                                emptyMessage="No tools ready for turnover"
                            />
                        </CardContent>
                    </Card>
                )}

                {/* History Tab */}
                {activeTab === "history" && (
                    <Card className="bg-white border-slate-200 shadow-sm">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle>Transaction History</CardTitle>
                                    <CardDescription>Complete record of all tool transactions</CardDescription>
                                </div>
                                <div className="flex items-center gap-3">
                                    <SearchBar
                                        value={searchQuery}
                                        onChange={setSearchQuery}
                                        placeholder="Search transactions..."
                                        className="w-64"
                                    />
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" size="icon" className="h-10 w-10">
                                                <Filter className="h-4 w-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-64" align="end">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-sm mb-2 block">Date Range</label>
                                                    <FilterBar
                                                        filters={[
                                                            {
                                                                value: dateFilter,
                                                                onChange: setDateFilter,
                                                                options: [
                                                                    { value: "all", label: "All Time" },
                                                                    { value: "today", label: "Today" },
                                                                    { value: "week", label: "This Week" },
                                                                    { value: "month", label: "This Month" },
                                                                ],
                                                                placeholder: "Date Range",
                                                            },
                                                        ]}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm mb-2 block">Section</label>
                                                    <FilterBar
                                                        filters={[
                                                            {
                                                                value: sectionFilter,
                                                                onChange: setSectionFilter,
                                                                options: [
                                                                    { value: "all", label: "All Sections" },
                                                                    { value: "Section A", label: "Section A" },
                                                                    { value: "Section B", label: "Section B" },
                                                                ],
                                                                placeholder: "Section",
                                                            },
                                                        ]}
                                                    />
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-200">
                                        <TableHead className="text-slate-600">Transaction ID</TableHead>
                                        <TableHead className="text-slate-600">Tool</TableHead>
                                        <TableHead className="text-slate-600">Student</TableHead>
                                        <TableHead className="text-slate-600">Section</TableHead>
                                        <TableHead className="text-slate-600">Qty</TableHead>
                                        <TableHead className="text-slate-600">Date</TableHead>
                                        <TableHead className="text-slate-600">Time</TableHead>
                                        <TableHead className="text-slate-600">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTransactions.map((t) => {
                                        const tool = filteredTools.find((tool) => tool.id === t.toolId);
                                        const borrowDate = new Date(t.borrowedAt);
                                        return (
                                            <TableRow key={t.id} className="border-slate-100">
                                                <TableCell className="font-mono text-sm text-slate-900">{t.id}</TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="text-slate-900">{t.toolName}</p>
                                                        <p className="text-xs text-slate-500">{tool?.id || "T-001"}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="text-slate-900">{t.studentName}</p>
                                                        <p className="text-xs text-slate-500">{t.studentId}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-900">{t.section}</TableCell>
                                                <TableCell className="text-slate-900">{t.quantity || 1}</TableCell>
                                                <TableCell className="text-slate-600">
                                                    {borrowDate.toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-slate-600">
                                                    {borrowDate.toLocaleTimeString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            t.status === "borrowed"
                                                                ? "bg-orange-50 text-orange-600 border-orange-200"
                                                                : t.status === "returned"
                                                                ? "bg-green-50 text-green-600 border-green-200"
                                                                : t.status === "turned-over"
                                                                ? "bg-purple-50 text-purple-600 border-purple-200"
                                                                : "bg-blue-50 text-blue-600 border-blue-200"
                                                        }
                                                    >
                                                        {t.status === "borrowed"
                                                            ? "Borrowed"
                                                            : t.status === "returned"
                                                            ? "Returned"
                                                            : t.status === "turned-over"
                                                            ? "Turned Over"
                                                            : t.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {/* Reports Tab */}
                {activeTab === "reports" && (
                    <InstructorReportsTab
                        tools={filteredTools}
                        transactions={instructorTransactions}
                        borrowedCount={borrowedTools.length}
                        returnedCount={returnedTools.length}
                        instructorName={INSTRUCTOR_NAME}
                    />
                )}
            </DashboardLayout>

            {/* Dialogs */}
            <ToolFormDialog
                open={isAddToolDialogOpen}
                onOpenChange={setIsAddToolDialogOpen}
                title="Add New Tool"
                description="Add a new tool to your inventory"
                toolData={newToolData}
                onToolDataChange={setNewToolData}
                onSubmit={handleToolAdd}
                submitLabel="Add Tool"
            />

            <ToolFormDialog
                open={isEditToolDialogOpen}
                onOpenChange={setIsEditToolDialogOpen}
                title="Edit Tool"
                description="Update tool information"
                toolData={editingTool || newToolData}
                onToolDataChange={setEditingTool}
                onSubmit={handleToolUpdate}
                submitLabel="Update Tool"
            />

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
                        <AlertDialogAction onClick={handleToolDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <QRCodeGenerator
                open={showQRDialog}
                onOpenChange={setShowQRDialog}
                transactionId={generatedTransactionId}
                toolName={selectedTools.length > 0 ? filteredTools.find((t) => t.id === selectedTools[0])?.name : "Tool"}
            />
        </div>
    );
}
