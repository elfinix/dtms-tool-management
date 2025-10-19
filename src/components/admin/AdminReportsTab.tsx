import { useState, useMemo } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Download, FileText, TrendingUp, Award, Clock, Calendar } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useAppContext } from "../../contexts/AppContext";

export function AdminReportsTab() {
  const { tools, transactions } = useAppContext();
  const [dateRange, setDateRange] = useState("7days");
  const [filterUser, setFilterUser] = useState("all");
  const [filterTool, setFilterTool] = useState("all");

  // Calculate real stats from live data
  const totalTransactions = transactions.length;
  
  // Calculate return compliance (on-time returns vs total returns)
  const returnedTransactions = transactions.filter(t => t.status === "returned");
  const onTimeReturns = returnedTransactions.filter(t => {
    if (!t.returnedAt) return false;
    const returnDate = new Date(t.returnedAt);
    const dueDate = new Date(t.dueDate);
    return returnDate <= dueDate;
  }).length;
  const returnCompliance = returnedTransactions.length > 0 
    ? Math.round((onTimeReturns / returnedTransactions.length) * 100) 
    : 0;
  
  // Calculate average borrow time in hours
  const avgBorrowTime = useMemo(() => {
    const completedTransactions = transactions.filter(t => t.returnedAt);
    if (completedTransactions.length === 0) return 0;
    
    const totalHours = completedTransactions.reduce((sum, t) => {
      const borrowed = new Date(t.borrowedAt);
      const returned = new Date(t.returnedAt!);
      const hours = (returned.getTime() - borrowed.getTime()) / (1000 * 60 * 60);
      return sum + hours;
    }, 0);
    
    return (totalHours / completedTransactions.length).toFixed(1);
  }, [transactions]);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-0">
        <div>
          <h2 className="text-blue-900">Reports & Analytics</h2>
          <p className="text-muted-foreground">Comprehensive tool usage data and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-blue-200 hover:bg-blue-50 flex-1 md:flex-none">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md flex-1 md:flex-none">
            <FileText className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200 shadow-md">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Total Transactions</p>
                <p className="text-blue-700">{totalTransactions}</p>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shadow-sm">
                <TrendingUp className="w-5 h-5 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-white to-green-50 border-green-100 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Return Compliance</p>
                <p className="text-green-700">{returnCompliance}%</p>
                <p className="text-xs text-muted-foreground mt-1">On-time returns</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shadow-sm">
                <Award className="w-5 h-5 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-100 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Avg. Borrow Time</p>
                <p className="text-purple-700">{avgBorrowTime} hrs</p>
                <p className="text-xs text-muted-foreground mt-1">Average duration</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shadow-sm">
                <Clock className="w-5 h-5 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-100 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Total Tools</p>
                <p className="text-orange-700">{tools.length}</p>
                <p className="text-xs text-muted-foreground mt-1">In inventory</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shadow-sm">
                <Calendar className="w-5 h-5 text-orange-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-white to-blue-50/30 border-blue-100 shadow-md">
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

        <Card className="bg-gradient-to-br from-white to-green-50/30 border-green-100 shadow-md">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-white to-purple-50/30 border-purple-100 shadow-md">
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

        <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200 shadow-md">
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

      {/* Top Borrowers */}
      <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200 shadow-md">
        <CardHeader>
          <CardTitle>Top Borrowers</CardTitle>
          <CardDescription>Students with highest tool usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topBorrowers.map((borrower) => (
              <div key={borrower.rank} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    borrower.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                    borrower.rank === 2 ? "bg-slate-100 text-slate-700" :
                    borrower.rank === 3 ? "bg-orange-100 text-orange-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    #{borrower.rank}
                  </div>
                  <div>
                    <p className="text-blue-900">{borrower.name}</p>
                    <p className="text-sm text-muted-foreground">{borrower.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-8 justify-between sm:justify-end">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Borrows</p>
                    <p>{borrower.borrows}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Returns</p>
                    <p>{borrower.returns}</p>
                  </div>
                  <div className="flex items-center justify-center">
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
  );
}
