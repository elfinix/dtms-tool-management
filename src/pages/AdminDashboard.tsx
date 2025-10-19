import { useState } from "react";
import { DashboardSidebar, NavItem } from "../components/layout/DashboardSidebar";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { StatsCard } from "../components/dashboard/StatsCard";
import { SearchBar } from "../components/dashboard/SearchBar";
import { UserManagementTable } from "../components/admin/UserManagementTable";
import { UserFormDialog } from "../components/admin/UserFormDialog";
import { TransactionTable } from "../components/admin/TransactionTable";
import { AdminReportsTab } from "../components/admin/AdminReportsTab";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import {
    LayoutDashboard,
    History,
    Users,
    FileText,
    Settings,
    CheckCircle2,
    Clock,
    RefreshCw,
    Plus,
    Download,
} from "lucide-react";
import { useUserManagement } from "../hooks/useUserManagement";
import { useTransactions } from "../hooks/useTransactions";
import { useAppContext } from "../contexts/AppContext";

interface AdminDashboardProps {
    onNavigate: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
    const { transactions, instructors } = useAppContext();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // User Management
    const {
        filteredUsers,
        searchQuery: userSearchQuery,
        setSearchQuery: setUserSearchQuery,
        handleAddUser,
        handleUpdateUser,
        handleDeleteUser,
    } = useUserManagement();

    const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
    const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
    const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [deletingUser, setDeletingUser] = useState<any>(null);
    const [newUserData, setNewUserData] = useState({ name: "", role: "", email: "" });

    // Transaction Management
    const {
        filteredTransactions,
        searchQuery: transactionSearchQuery,
        setSearchQuery: setTransactionSearchQuery,
        statusFilter: transactionStatusFilter,
        setStatusFilter: setTransactionStatusFilter,
    } = useTransactions();

    // System Settings
    const [systemSettings, setSystemSettings] = useState({
        emailNotifications: {
            enabled: true,
            turnoverAlerts: true,
            dailySummary: false,
            recipientEmail: "admin@dpraviation.edu",
        },
        backupSchedule: { enabled: true, frequency: "daily", time: "02:00", lastBackup: new Date().toISOString() },
        userPermissions: { instructorCanDelete: false, instructorCanEditOthers: false, requireApproval: true },
    });
    const [isEmailSettingsOpen, setIsEmailSettingsOpen] = useState(false);
    const [isBackupSettingsOpen, setIsBackupSettingsOpen] = useState(false);
    const [isPermissionsSettingsOpen, setIsPermissionsSettingsOpen] = useState(false);

    // Statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const turnoverTransactions = transactions.filter((t) => t.status === "turned-over");
    const todayTurnovers = turnoverTransactions.filter(
        (t) => new Date(t.turnedOverAt || "").toDateString() === today.toDateString()
    );
    const pendingTurnovers = transactions.filter((t) => t.status === "returned").length;
    const activeBorrows = transactions.filter((t) => t.status === "borrowed").length;

    const stats = [
        {
            label: "Today's Turnovers",
            value: todayTurnovers.length.toString(),
            icon: CheckCircle2,
            color: "text-green-700",
            bg: "bg-green-100",
        },
        {
            label: "Pending Turnovers",
            value: pendingTurnovers.toString(),
            icon: Clock,
            color: "text-amber-700",
            bg: "bg-amber-100",
        },
        {
            label: "Active Borrows",
            value: activeBorrows.toString(),
            icon: RefreshCw,
            color: "text-blue-700",
            bg: "bg-blue-100",
        },
        {
            label: "Total Instructors",
            value: instructors.length.toString(),
            icon: Users,
            color: "text-purple-700",
            bg: "bg-purple-100",
        },
    ];

    const navItems: NavItem[] = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "users", label: "Users", icon: Users },
        { id: "transactions", label: "Transactions", icon: History },
        { id: "reports", label: "Reports", icon: FileText },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    // User Management Handlers
    const openEditUserDialog = (user: any) => {
        setEditingUser(user);
        setIsEditUserDialogOpen(true);
    };

    const openDeleteUserDialog = (user: any) => {
        setDeletingUser(user);
        setIsDeleteUserDialogOpen(true);
    };

    const handleUserAdd = () => {
        if (handleAddUser(newUserData as any)) {
            setIsAddUserDialogOpen(false);
            setNewUserData({ name: "", role: "", email: "" });
        }
    };

    const handleUserUpdate = () => {
        if (editingUser && handleUpdateUser(editingUser.id, editingUser)) {
            setIsEditUserDialogOpen(false);
            setEditingUser(null);
        }
    };

    const handleUserDelete = () => {
        if (deletingUser) {
            handleDeleteUser(deletingUser.id, deletingUser.name);
            setIsDeleteUserDialogOpen(false);
            setDeletingUser(null);
        }
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
            <DashboardSidebar
                navItems={navItems}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onLogout={() => onNavigate("landing")}
                title="DTMS"
                subtitle="Admin Panel"
                mobileMenuOpen={mobileMenuOpen}
                onMobileMenuChange={setMobileMenuOpen}
            />

            <DashboardLayout
                title="Admin Panel"
                description="Manage users, monitor transactions, and oversee the entire tool management system"
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
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Latest turnover transactions from instructors</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <TransactionTable transactions={turnoverTransactions.slice(0, 5)} />
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === "users" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <SearchBar
                                value={userSearchQuery}
                                onChange={setUserSearchQuery}
                                placeholder="Search users by name, email, or ID..."
                                className="flex-1 max-w-md"
                            />
                            <Button onClick={() => setIsAddUserDialogOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add User
                            </Button>
                        </div>

                        <UserManagementTable
                            users={filteredUsers}
                            onEdit={openEditUserDialog}
                            onDelete={openDeleteUserDialog}
                        />
                    </div>
                )}

                {/* Transactions Tab */}
                {activeTab === "transactions" && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <SearchBar
                                value={transactionSearchQuery}
                                onChange={setTransactionSearchQuery}
                                placeholder="Search transactions..."
                                className="flex-1 max-w-md"
                            />
                            <Select value={transactionStatusFilter} onValueChange={setTransactionStatusFilter}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="borrowed">Borrowed</SelectItem>
                                    <SelectItem value="returned">Returned</SelectItem>
                                    <SelectItem value="turned-over">Turned Over</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <TransactionTable transactions={filteredTransactions} />
                    </div>
                )}

                {/* Reports Tab */}
                {activeTab === "reports" && <AdminReportsTab />}

                {/* Settings Tab */}
                {activeTab === "settings" && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Email Notifications</CardTitle>
                                <CardDescription>Configure email alerts and summaries</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Enable Email Notifications</Label>
                                    <Switch
                                        checked={systemSettings.emailNotifications.enabled}
                                        onCheckedChange={(checked) =>
                                            setSystemSettings({
                                                ...systemSettings,
                                                emailNotifications: {
                                                    ...systemSettings.emailNotifications,
                                                    enabled: checked,
                                                },
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label>Turnover Alerts</Label>
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
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>System Backup</CardTitle>
                                <CardDescription>Configure automated backup schedule</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Enable Auto Backup</Label>
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
                                    <Label>Backup Frequency</Label>
                                    <Select
                                        value={systemSettings.backupSchedule.frequency}
                                        onValueChange={(value) =>
                                            setSystemSettings({
                                                ...systemSettings,
                                                backupSchedule: { ...systemSettings.backupSchedule, frequency: value },
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hourly">Hourly</SelectItem>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </DashboardLayout>

            {/* User Management Dialogs */}
            <UserFormDialog
                open={isAddUserDialogOpen}
                onOpenChange={setIsAddUserDialogOpen}
                title="Add New User"
                description="Create a new user account for DTMS"
                userData={newUserData}
                onUserDataChange={setNewUserData}
                onSubmit={handleUserAdd}
                submitLabel="Create User"
            />

            <UserFormDialog
                open={isEditUserDialogOpen}
                onOpenChange={setIsEditUserDialogOpen}
                title="Edit User"
                description="Update user information"
                userData={editingUser || { name: "", role: "", email: "" }}
                onUserDataChange={setEditingUser}
                onSubmit={handleUserUpdate}
                submitLabel="Update User"
            />

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
                        <AlertDialogAction onClick={handleUserDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
