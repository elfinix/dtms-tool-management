import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Switch } from "./ui/switch";
import { AdminReportsTab } from "./AdminReportsTab";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "./ui/sheet";
import {
    LayoutDashboard,
    History,
    Users,
    FileText,
    Settings,
    Download,
    Wrench,
    LogOut,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Search,
    Edit,
    Trash2,
    Menu,
    Filter,
    RefreshCw,
    Plus,
    Eye,
} from "lucide-react";
import { toast } from "sonner";
import { useAppContext } from "./AppContext";

interface AdminDashboardProps {
    onNavigate: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
    const { transactions, instructors, users, addUser, updateUser, removeUser } = useAppContext();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
    const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [newUserData, setNewUserData] = useState({
        name: "",
        role: "" as "Instructor" | "Admin" | "",
        email: "",
    });

    // User management state
    const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
    const [deletingUser, setDeletingUser] = useState<any>(null);

    // System Settings state
    const [systemSettings, setSystemSettings] = useState({
        emailNotifications: {
            enabled: true,
            turnoverAlerts: true,
            dailySummary: false,
            recipientEmail: "admin@dpraviation.edu",
        },
        backupSchedule: {
            enabled: true,
            frequency: "daily",
            time: "02:00",
            lastBackup: new Date().toISOString(),
        },
        userPermissions: {
            instructorCanDelete: false,
            instructorCanEditOthers: false,
            requireApproval: true,
        },
    });
    const [isEmailSettingsOpen, setIsEmailSettingsOpen] = useState(false);
    const [isBackupSettingsOpen, setIsBackupSettingsOpen] = useState(false);
    const [isPermissionsSettingsOpen, setIsPermissionsSettingsOpen] = useState(false);

    // Filter states
    const [transactionStatusFilter, setTransactionStatusFilter] = useState<string>("all");
    const [transactionDateFilter, setTransactionDateFilter] = useState<string>("all");
    const [transactionSearchQuery, setTransactionSearchQuery] = useState<string>("");
    const [userStatusFilter, setUserStatusFilter] = useState<string>("all");
    const [userSearchQuery, setUserSearchQuery] = useState<string>("");

    // View user transactions dialog
    const [isViewUserDialogOpen, setIsViewUserDialogOpen] = useState(false);
    const [viewingUser, setViewingUser] = useState<any>(null);

    // Calculate real stats from live data - focusing on instructor turnover transactions
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const turnoverTransactions = transactions.filter((t) => t.status === "turned-over");
    const todayTurnovers = turnoverTransactions.filter((t) => {
        const transactionDate = new Date(t.turnedOverAt || "");
        transactionDate.setHours(0, 0, 0, 0);
        return transactionDate.getTime() === today.getTime();
    });

    const totalInstructors = instructors.length;
    const instructorsWithTools = instructors.filter((i) => i.toolStatus === "tools-in-use").length;
    const instructorsTurnedOver = instructors.filter((i) => i.toolStatus === "all-turned-over").length;

    const stats = [
        {
            label: "Total Instructors",
            value: totalInstructors.toString(),
            icon: Users,
            color: "text-blue-700",
            bg: "bg-blue-100",
        },
        {
            label: "Turnovers Today",
            value: todayTurnovers.length.toString(),
            icon: Clock,
            color: "text-green-700",
            bg: "bg-green-100",
        },
        {
            label: "Instructors with Tools",
            value: instructorsWithTools.toString(),
            icon: RefreshCw,
            color: "text-orange-700",
            bg: "bg-orange-100",
        },
        {
            label: "All Turned Over",
            value: instructorsTurnedOver.toString(),
            icon: CheckCircle2,
            color: "text-purple-700",
            bg: "bg-purple-100",
        },
    ];

    // Recent turnover transactions from real data
    const now = new Date();
    const recentTransactions = transactions
        .filter((t) => t.status === "turned-over")
        .slice()
        .sort((a, b) => new Date(b.turnedOverAt || "").getTime() - new Date(a.turnedOverAt || "").getTime())
        .slice(0, 5)
        .map((t) => ({
            id: t.id,
            tool: t.toolName,
            instructor: t.instructorName,
            student: t.studentName,
            date: new Date(t.turnedOverAt || "").toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            }),
            quantity: t.quantity,
            status: "turned-over",
        }));

    // Filtered transactions based on status, date, and search
    const filteredTransactions = transactions.filter((t) => {
        // Search filter
        const matchesSearch =
            transactionSearchQuery === "" ||
            t.id.toLowerCase().includes(transactionSearchQuery.toLowerCase()) ||
            t.toolName.toLowerCase().includes(transactionSearchQuery.toLowerCase()) ||
            t.instructorName.toLowerCase().includes(transactionSearchQuery.toLowerCase()) ||
            t.studentName.toLowerCase().includes(transactionSearchQuery.toLowerCase()) ||
            t.studentId.toLowerCase().includes(transactionSearchQuery.toLowerCase());

        // Status filter
        const statusMatch = transactionStatusFilter === "all" || t.status === transactionStatusFilter;

        // Date filter
        let dateMatch = true;
        if (transactionDateFilter !== "all") {
            const transactionDate = new Date(t.turnedOverAt || t.borrowedAt);
            transactionDate.setHours(0, 0, 0, 0);

            if (transactionDateFilter === "today") {
                dateMatch = transactionDate.getTime() === today.getTime();
            } else if (transactionDateFilter === "week") {
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                dateMatch = transactionDate >= weekAgo;
            } else if (transactionDateFilter === "month") {
                const monthAgo = new Date(today);
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                dateMatch = transactionDate >= monthAgo;
            }
        }

        return matchesSearch && statusMatch && dateMatch;
    });

    // User management handlers
    const handleDeleteUser = () => {
        if (!deletingUser) return;

        removeUser(deletingUser.id);
        toast.success(`User ${deletingUser.name} has been removed from the system`);
        setIsDeleteUserDialogOpen(false);
        setDeletingUser(null);
    };

    const openDeleteUserDialog = (user: any) => {
        setDeletingUser(user);
        setIsDeleteUserDialogOpen(true);
    };

    const handleAddUser = () => {
        if (!newUserData.name || !newUserData.role || !newUserData.email) {
            toast.error("Please fill in all required fields");
            return;
        }

        addUser({
            name: newUserData.name,
            role: newUserData.role as "Instructor" | "Admin",
            email: newUserData.email,
        });

        toast.success(`${newUserData.role} account created for ${newUserData.name}`);
        setIsAddUserDialogOpen(false);
        setNewUserData({ name: "", role: "", email: "" });
    };

    const handleUpdateUser = () => {
        if (!editingUser?.name || !editingUser?.role || !editingUser?.email) {
            toast.error("Please fill in all required fields");
            return;
        }

        updateUser(editingUser.id, {
            name: editingUser.name,
            role: editingUser.role,
            email: editingUser.email,
        });

        toast.success(`User ${editingUser.name} updated successfully`);
        setIsEditUserDialogOpen(false);
        setEditingUser(null);
    };

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "users", label: "Users", icon: Users },
        { id: "transactions", label: "Transactions", icon: History },
        { id: "reports", label: "Reports", icon: FileText },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    const SidebarContent = () => (
        <>
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                        <Wrench className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-white">DTMS</h2>
                        <p className="text-xs text-blue-200">Admin Panel</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            setActiveTab(item.id);
                            setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                            activeTab === item.id
                                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50"
                                : "text-slate-300 hover:bg-white/10 hover:text-white"
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
                    className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/10"
                    onClick={() => onNavigate("landing")}
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </Button>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
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
                    <SheetDescription className="sr-only">Admin panel navigation menu</SheetDescription>
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
                    <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl text-blue-900 mb-2">Admin Panel</h1>
                            <p className="text-muted-foreground text-sm md:text-base">
                                Welcome, Administrator. Your central hub for tool inventory, user management, and system
                                oversight.
                            </p>
                        </div>
                    </div>

                    {activeTab === "dashboard" && (
                        <div className="space-y-6" key="dashboard">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <Card className="bg-gradient-to-br from-white to-blue-50/50 border-blue-100 shadow-md">
                                    <CardHeader>
                                        <CardTitle>Quick Actions</CardTitle>
                                        <CardDescription>Common administrative tasks</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <Button
                                            className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md"
                                            onClick={() => setIsAddUserDialogOpen(true)}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add New Instructor
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start border-blue-200 hover:bg-blue-50 hover:text-blue-900"
                                            onClick={() => setActiveTab("reports")}
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Generate Report
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-md">
                                    <CardHeader>
                                        <CardTitle>System Status</CardTitle>
                                        <CardDescription>Real-time system health</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Database Status</span>
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                Online
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">QR Scanner</span>
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                Active
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Last Backup</span>
                                            <span className="text-sm text-muted-foreground">2 hours ago</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Recent Turnover Transactions Table */}
                            <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200 shadow-md">
                                <CardHeader>
                                    <CardTitle>Recent Tool Turnovers</CardTitle>
                                    <CardDescription>Latest tools turned over by instructors</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Transaction ID</TableHead>
                                                    <TableHead>Tool</TableHead>
                                                    <TableHead>Instructor</TableHead>
                                                    <TableHead>Qty</TableHead>
                                                    <TableHead>Turned Over</TableHead>
                                                    <TableHead>Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {recentTransactions.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                                            No recent turnovers
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    recentTransactions.map((transaction) => (
                                                        <TableRow key={transaction.id}>
                                                            <TableCell>{transaction.id}</TableCell>
                                                            <TableCell>{transaction.tool}</TableCell>
                                                            <TableCell className="text-slate-700">
                                                                {transaction.instructor}
                                                            </TableCell>
                                                            <TableCell>{transaction.quantity}</TableCell>
                                                            <TableCell className="text-slate-600">
                                                                {transaction.date}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-purple-50 text-purple-700 border-purple-200"
                                                                >
                                                                    Turned Over
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

                    {activeTab === "transactions" && (
                        <div className="space-y-6" key="transactions">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="text-blue-900">Instructor Tool Turnovers</h2>
                                    <p className="text-muted-foreground">Monitor tools returned by instructors</p>
                                </div>
                            </div>

                            <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200 shadow-md">
                                <CardHeader>
                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <CardTitle>All Transactions</CardTitle>
                                            <CardDescription>Complete transaction history</CardDescription>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search transactions..."
                                                    className="pl-9 w-full md:w-64"
                                                    value={transactionSearchQuery}
                                                    onChange={(e) => setTransactionSearchQuery(e.target.value)}
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
                                                                value={transactionStatusFilter}
                                                                onValueChange={setTransactionStatusFilter}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Filter by status" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="all">All Status</SelectItem>
                                                                    <SelectItem value="borrowed">Borrowed</SelectItem>
                                                                    <SelectItem value="returned">Returned</SelectItem>
                                                                    <SelectItem value="turned-over">Turned Over</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Date Range</Label>
                                                            <Select
                                                                value={transactionDateFilter}
                                                                onValueChange={setTransactionDateFilter}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Filter by date" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="all">All Time</SelectItem>
                                                                    <SelectItem value="today">Today</SelectItem>
                                                                    <SelectItem value="week">This Week</SelectItem>
                                                                    <SelectItem value="month">This Month</SelectItem>
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
                                                    <TableHead>Instructor</TableHead>
                                                    <TableHead>Student</TableHead>
                                                    <TableHead>Qty</TableHead>
                                                    <TableHead>Borrowed</TableHead>
                                                    <TableHead>Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredTransactions.map((transaction) => (
                                                    <TableRow key={transaction.id}>
                                                        <TableCell>{transaction.id}</TableCell>
                                                        <TableCell>{transaction.toolName}</TableCell>
                                                        <TableCell className="text-slate-700">
                                                            {transaction.instructorName}
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
                                                        <TableCell className="text-slate-600">
                                                            {new Date(transaction.borrowedAt).toLocaleDateString()}
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
                                                                {transaction.status === "borrowed"
                                                                    ? "Borrowed"
                                                                    : transaction.status === "returned"
                                                                    ? "Returned"
                                                                    : transaction.status === "turned-over"
                                                                    ? "Turned Over"
                                                                    : "Pending"}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === "users" && (
                        <div className="space-y-6" key="users">
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-0">
                                <div>
                                    <h2 className="text-blue-900">User Management</h2>
                                    <p className="text-muted-foreground">Manage instructors and administrators</p>
                                </div>
                                <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add New User
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Add New User</DialogTitle>
                                            <DialogDescription>Enter user details to create a new account</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="user-name">Full Name *</Label>
                                                <Input
                                                    id="user-name"
                                                    placeholder="Enter full name"
                                                    value={newUserData.name}
                                                    onChange={(e) =>
                                                        setNewUserData({ ...newUserData, name: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="user-role">Role *</Label>
                                                <Select
                                                    value={newUserData.role}
                                                    onValueChange={(value) =>
                                                        setNewUserData({ ...newUserData, role: value })
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Instructor">Instructor</SelectItem>
                                                        <SelectItem value="Admin">Admin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="user-email">Email *</Label>
                                                <Input
                                                    id="user-email"
                                                    type="email"
                                                    placeholder="email@dpraviation.edu"
                                                    value={newUserData.email}
                                                    onChange={(e) =>
                                                        setNewUserData({ ...newUserData, email: e.target.value })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() => {
                                                    setIsAddUserDialogOpen(false);
                                                    setNewUserData({ name: "", role: "", email: "" });
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                                                onClick={handleAddUser}
                                            >
                                                Create User
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200 shadow-md">
                                <CardHeader>
                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <CardTitle>Instructors</CardTitle>
                                            <CardDescription>Manage instructor accounts</CardDescription>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search users..."
                                                    className="pl-9 w-full md:w-64"
                                                    value={userSearchQuery}
                                                    onChange={(e) => setUserSearchQuery(e.target.value)}
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
                                                                value={userStatusFilter}
                                                                onValueChange={setUserStatusFilter}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Filter by status" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="all">All Status</SelectItem>
                                                                    <SelectItem value="active">Active</SelectItem>
                                                                    <SelectItem value="inactive">Inactive</SelectItem>
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
                                                    <TableHead>User ID</TableHead>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Email</TableHead>
                                                    <TableHead>Tool Status</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Join Date</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {users
                                                    .filter((user) => {
                                                        const searchMatch =
                                                            userSearchQuery === "" ||
                                                            user.name
                                                                .toLowerCase()
                                                                .includes(userSearchQuery.toLowerCase()) ||
                                                            user.email
                                                                .toLowerCase()
                                                                .includes(userSearchQuery.toLowerCase()) ||
                                                            user.id.toLowerCase().includes(userSearchQuery.toLowerCase());
                                                        const statusMatch =
                                                            userStatusFilter === "all" || user.status === userStatusFilter;
                                                        return searchMatch && statusMatch;
                                                    })
                                                    .map((user) => (
                                                        <TableRow key={user.id}>
                                                            <TableCell>{user.id}</TableCell>
                                                            <TableCell>{user.name}</TableCell>
                                                            <TableCell className="text-slate-600">{user.email}</TableCell>
                                                            <TableCell>
                                                                {user.role === "Instructor" && user.toolStatus ? (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className={
                                                                            user.toolStatus === "tools-in-use"
                                                                                ? "bg-orange-50 text-orange-700 border-orange-200"
                                                                                : user.toolStatus === "all-turned-over"
                                                                                ? "bg-green-50 text-green-700 border-green-200"
                                                                                : "bg-gray-50 text-gray-700 border-gray-200"
                                                                        }
                                                                    >
                                                                        {user.toolStatus === "tools-in-use"
                                                                            ? "Tools In Use"
                                                                            : user.toolStatus === "all-turned-over"
                                                                            ? "All Turned Over"
                                                                            : "No Tools"}
                                                                    </Badge>
                                                                ) : (
                                                                    <span className="text-muted-foreground text-sm">
                                                                        N/A
                                                                    </span>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={
                                                                        user.status === "active"
                                                                            ? "bg-green-50 text-green-700 border-green-200"
                                                                            : "bg-gray-50 text-gray-700 border-gray-200"
                                                                    }
                                                                >
                                                                    {user.status}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-muted-foreground">
                                                                {user.joinDate}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="hover:bg-blue-50 hover:text-blue-700"
                                                                        onClick={() => {
                                                                            setViewingUser(user);
                                                                            setIsViewUserDialogOpen(true);
                                                                        }}
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="hover:bg-amber-50 hover:text-amber-700"
                                                                        onClick={() => {
                                                                            setEditingUser(user);
                                                                            setIsEditUserDialogOpen(true);
                                                                        }}
                                                                    >
                                                                        <Edit className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="hover:bg-red-50 hover:text-red-700"
                                                                        onClick={() => openDeleteUserDialog(user)}
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === "reports" && (
                        <div className="space-y-6" key="reports">
                            <AdminReportsTab />
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div className="space-y-6" key="settings">
                            <div>
                                <h2 className="text-blue-900">System Settings</h2>
                                <p className="text-muted-foreground">Configure system preferences and behavior</p>
                            </div>

                            <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200 shadow-md">
                                <CardHeader>
                                    <CardTitle>Notification Settings</CardTitle>
                                    <CardDescription>Configure email alerts and notifications</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                            <div>
                                                <p>Email Notifications</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {systemSettings.emailNotifications.enabled ? "Enabled" : "Disabled"} •{" "}
                                                    {systemSettings.emailNotifications.recipientEmail}
                                                </p>
                                            </div>
                                            <Button variant="outline" size="sm" onClick={() => setIsEmailSettingsOpen(true)}>
                                                Configure
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200 shadow-md">
                                <CardHeader>
                                    <CardTitle>Data Management</CardTitle>
                                    <CardDescription>Backup and data retention settings</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                            <div>
                                                <p>Backup Schedule</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {systemSettings.backupSchedule.enabled
                                                        ? `${systemSettings.backupSchedule.frequency} at ${systemSettings.backupSchedule.time}`
                                                        : "Disabled"}
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setIsBackupSettingsOpen(true)}
                                            >
                                                Configure
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200 shadow-md">
                                <CardHeader>
                                    <CardTitle>Access Control</CardTitle>
                                    <CardDescription>Manage user permissions and access levels</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                            <div>
                                                <p>User Permissions</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Role-based access control settings
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setIsPermissionsSettingsOpen(true)}
                                            >
                                                Configure
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </main>

            {/* Edit User Dialog */}
            <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>Update user information</DialogDescription>
                    </DialogHeader>
                    {editingUser && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-user-name">Full Name *</Label>
                                <Input
                                    id="edit-user-name"
                                    value={editingUser.name}
                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-user-role">Role *</Label>
                                <Select
                                    value={editingUser.role}
                                    onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Instructor">Instructor</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-user-email">Email *</Label>
                                <Input
                                    id="edit-user-email"
                                    type="email"
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                                setIsEditUserDialogOpen(false);
                                setEditingUser(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                            onClick={handleUpdateUser}
                        >
                            Save Changes
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* View User Transactions Dialog */}
            <Dialog open={isViewUserDialogOpen} onOpenChange={setIsViewUserDialogOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Recent Tool Turnovers</DialogTitle>
                        <DialogDescription>{viewingUser?.name} - Recent transactions by day</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="overflow-x-auto max-h-96">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Tool</TableHead>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions
                                        .filter((t) => t.instructorName === viewingUser?.name && t.status === "turned-over")
                                        .sort(
                                            (a, b) =>
                                                new Date(b.turnedOverAt || "").getTime() -
                                                new Date(a.turnedOverAt || "").getTime()
                                        )
                                        .slice(0, 10)
                                        .map((transaction) => (
                                            <TableRow key={transaction.id}>
                                                <TableCell className="text-slate-600">
                                                    {new Date(transaction.turnedOverAt || "").toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>{transaction.toolName}</TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p>{transaction.studentName}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {transaction.studentId}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{transaction.quantity}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-green-50 text-green-700 border-green-200"
                                                    >
                                                        Turned Over
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    {transactions.filter(
                                        (t) => t.instructorName === viewingUser?.name && t.status === "turned-over"
                                    ).length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                                                No turnover transactions found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete User Dialog */}
            <AlertDialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {deletingUser?.name}? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteUser}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Email Notifications Settings Dialog */}
            <Dialog open={isEmailSettingsOpen} onOpenChange={setIsEmailSettingsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Email Notification Settings</DialogTitle>
                        <DialogDescription>Configure when and where to receive email notifications</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Enable Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">Receive email alerts for system events</p>
                            </div>
                            <Switch
                                checked={systemSettings.emailNotifications.enabled}
                                onCheckedChange={(checked) =>
                                    setSystemSettings({
                                        ...systemSettings,
                                        emailNotifications: { ...systemSettings.emailNotifications, enabled: checked },
                                    })
                                }
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Tool Turnover Alerts</Label>
                                <p className="text-sm text-muted-foreground">Notify when tools are turned over</p>
                            </div>
                            <Switch
                                checked={systemSettings.emailNotifications.turnoverAlerts}
                                onCheckedChange={(checked) =>
                                    setSystemSettings({
                                        ...systemSettings,
                                        emailNotifications: {
                                            ...systemSettings.emailNotifications,
                                            turnoverAlerts: checked,
                                        },
                                    })
                                }
                                disabled={!systemSettings.emailNotifications.enabled}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Daily Summary</Label>
                                <p className="text-sm text-muted-foreground">Receive daily activity summary</p>
                            </div>
                            <Switch
                                checked={systemSettings.emailNotifications.dailySummary}
                                onCheckedChange={(checked) =>
                                    setSystemSettings({
                                        ...systemSettings,
                                        emailNotifications: { ...systemSettings.emailNotifications, dailySummary: checked },
                                    })
                                }
                                disabled={!systemSettings.emailNotifications.enabled}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="recipient-email">Recipient Email</Label>
                            <Input
                                id="recipient-email"
                                type="email"
                                value={systemSettings.emailNotifications.recipientEmail}
                                onChange={(e) =>
                                    setSystemSettings({
                                        ...systemSettings,
                                        emailNotifications: {
                                            ...systemSettings.emailNotifications,
                                            recipientEmail: e.target.value,
                                        },
                                    })
                                }
                                disabled={!systemSettings.emailNotifications.enabled}
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={() => setIsEmailSettingsOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                            onClick={() => {
                                toast.success("Email notification settings saved");
                                setIsEmailSettingsOpen(false);
                            }}
                        >
                            Save Settings
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Backup Schedule Settings Dialog */}
            <Dialog open={isBackupSettingsOpen} onOpenChange={setIsBackupSettingsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Backup Schedule Settings</DialogTitle>
                        <DialogDescription>Configure automatic backup frequency and timing</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Enable Automatic Backups</Label>
                                <p className="text-sm text-muted-foreground">Automatically backup system data</p>
                            </div>
                            <Switch
                                checked={systemSettings.backupSchedule.enabled}
                                onCheckedChange={(checked) =>
                                    setSystemSettings({
                                        ...systemSettings,
                                        backupSchedule: { ...systemSettings.backupSchedule, enabled: checked },
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="backup-frequency">Backup Frequency</Label>
                            <Select
                                value={systemSettings.backupSchedule.frequency}
                                onValueChange={(value) =>
                                    setSystemSettings({
                                        ...systemSettings,
                                        backupSchedule: { ...systemSettings.backupSchedule, frequency: value },
                                    })
                                }
                                disabled={!systemSettings.backupSchedule.enabled}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hourly">Hourly</SelectItem>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="backup-time">Backup Time</Label>
                            <Input
                                id="backup-time"
                                type="time"
                                value={systemSettings.backupSchedule.time}
                                onChange={(e) =>
                                    setSystemSettings({
                                        ...systemSettings,
                                        backupSchedule: { ...systemSettings.backupSchedule, time: e.target.value },
                                    })
                                }
                                disabled={!systemSettings.backupSchedule.enabled}
                            />
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-900">
                                <strong>Last Backup:</strong>{" "}
                                {new Date(systemSettings.backupSchedule.lastBackup).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={() => setIsBackupSettingsOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                            onClick={() => {
                                toast.success("Backup schedule settings saved");
                                setIsBackupSettingsOpen(false);
                            }}
                        >
                            Save Settings
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* User Permissions Settings Dialog */}
            <Dialog open={isPermissionsSettingsOpen} onOpenChange={setIsPermissionsSettingsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>User Permissions Settings</DialogTitle>
                        <DialogDescription>Configure role-based access control and permissions</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Instructors Can Delete Tools</Label>
                                <p className="text-sm text-muted-foreground">
                                    Allow instructors to delete tools from inventory
                                </p>
                            </div>
                            <Switch
                                checked={systemSettings.userPermissions.instructorCanDelete}
                                onCheckedChange={(checked) =>
                                    setSystemSettings({
                                        ...systemSettings,
                                        userPermissions: { ...systemSettings.userPermissions, instructorCanDelete: checked },
                                    })
                                }
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Instructors Can Edit Other Tools</Label>
                                <p className="text-sm text-muted-foreground">
                                    Allow instructors to modify other instructors' tools
                                </p>
                            </div>
                            <Switch
                                checked={systemSettings.userPermissions.instructorCanEditOthers}
                                onCheckedChange={(checked) =>
                                    setSystemSettings({
                                        ...systemSettings,
                                        userPermissions: {
                                            ...systemSettings.userPermissions,
                                            instructorCanEditOthers: checked,
                                        },
                                    })
                                }
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Require Admin Approval</Label>
                                <p className="text-sm text-muted-foreground">New tool additions require admin approval</p>
                            </div>
                            <Switch
                                checked={systemSettings.userPermissions.requireApproval}
                                onCheckedChange={(checked) =>
                                    setSystemSettings({
                                        ...systemSettings,
                                        userPermissions: { ...systemSettings.userPermissions, requireApproval: checked },
                                    })
                                }
                            />
                        </div>
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <p className="text-sm text-amber-900">
                                ⚠️ Changes to permissions will affect all users immediately
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={() => setIsPermissionsSettingsOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                            onClick={() => {
                                toast.success("User permissions settings saved");
                                setIsPermissionsSettingsOpen(false);
                            }}
                        >
                            Save Settings
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
