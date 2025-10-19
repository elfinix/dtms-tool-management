import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { ArrowLeft, QrCode, PackagePlus, PackageMinus, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAppContext } from "../contexts/AppContext";

// Section options
const sections = [
    "AMT-1A",
    "AMT-1B",
    "AMT-1C",
    "AMT-2A",
    "AMT-2B",
    "AMT-2C",
    "AMT-3A",
    "AMT-3B",
    "AMT-3C",
    "AMT-4A",
    "AMT-4B",
    "AMT-4C",
];

interface StudentQRAccessProps {
    onNavigate: (page: string) => void;
}

// Mock instructor data with shift times
const instructors = [
    { id: "U-001", name: "Prof. Richard Anderson", shift: "08:00 AM - 02:00 PM" },
    { id: "U-002", name: "Dr. Sarah Mitchell", shift: "02:00 PM - 08:00 PM" },
    { id: "U-003", name: "Eng. Michael Torres", shift: "08:00 AM - 04:00 PM" },
    { id: "U-004", name: "Dr. Jennifer Lee", shift: "10:00 AM - 06:00 PM" },
    { id: "U-005", name: "Prof. David Chen", shift: "06:00 AM - 12:00 PM" },
];

export function StudentQRAccess({ onNavigate }: StudentQRAccessProps) {
    const { tools, transactions, addTransaction, completeTransaction, getTransactionById, addBorrower } = useAppContext();
    const [scannedTool, setScannedTool] = useState<any>(null);
    const [studentName, setStudentName] = useState("");
    const [studentId, setStudentId] = useState("");
    const [section, setSection] = useState("");
    const [manualMode, setManualMode] = useState(false);
    const [transactionId, setTransactionId] = useState("");

    // Simulate QR scan
    const handleScan = () => {
        // Demo mode: Just pick a random available tool for simulation
        const availableTools = tools.filter((t) => t.status === "available");

        if (availableTools.length === 0) {
            toast.error("No tools available for demo. All tools are currently borrowed.");
            return;
        }

        // Pick a random tool
        const randomTool = availableTools[Math.floor(Math.random() * availableTools.length)];

        // Pick a random instructor
        const randomInstructor = instructors[Math.floor(Math.random() * instructors.length)];

        // Generate a display tracking ID (simulating what would be encoded in QR)
        const displayTrackingId = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;

        // Calculate due time (4 hours from now)
        const dueDate = new Date();
        dueDate.setHours(dueDate.getHours() + 4);

        // Set scanned tool data with simulated transaction information
        setScannedTool({
            id: randomTool.id,
            name: randomTool.name,
            category: randomTool.category,
            location: randomTool.location,
            image: randomTool.image,
            status: "available", // Set as available so form shows up
            condition: randomTool.condition,
            instructorName: randomInstructor.name,
            transactionId: displayTrackingId,
            dueTime: dueDate.toLocaleTimeString(),
        });

        setTransactionId(displayTrackingId);
        toast.success("QR Code scanned successfully!");
    };

    const handleBorrow = () => {
        if (!studentName || !studentId || !section || !transactionId) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (!scannedTool) {
            toast.error("No tool scanned");
            return;
        }

        // Calculate due date (4 hours from now)
        const dueDate = new Date();
        dueDate.setHours(dueDate.getHours() + 4);

        // Create a new transaction for the demo scan
        addTransaction({
            toolId: scannedTool.id,
            toolName: scannedTool.name,
            studentName,
            studentId,
            section,
            instructorName: scannedTool.instructorName,
            borrowedAt: new Date().toISOString(),
            returnedAt: null,
            status: "borrowed",
            dueDate: dueDate.toISOString(),
        });

        toast.success(`Item borrowed successfully! Please return by ${dueDate.toLocaleTimeString()}`);

        // Clear form and reset
        setTimeout(() => {
            setScannedTool(null);
            setStudentName("");
            setStudentId("");
            setSection("");
            setTransactionId("");
        }, 1500);
    };

    const handleReturn = () => {
        toast.success("Tool returned successfully! Thank you.");
        setTimeout(() => {
            setScannedTool(null);
            setStudentName("");
            setStudentId("");
            setSection("");
            setTransactionId("");
        }, 1000);
    };

    const handleManualBorrow = () => {
        if (!studentName || !studentId || !section || !transactionId) {
            toast.error("Please fill in all required fields");
            return;
        }

        // Validate tracking ID format (should be TRK-XXXXXX)
        if (!transactionId.match(/^TRK-\d{6}$/)) {
            toast.error("Invalid Tracking ID format. Please use format: TRK-123456");
            return;
        }

        // Demo mode: Check if there's a pending transaction, otherwise create a new one
        const pendingTransactions = transactions.filter((t) => t.status === "pending");

        if (pendingTransactions.length > 0) {
            // If there's a pending transaction, complete it (real workflow)
            const transaction = pendingTransactions[0];
            const tool = tools.find((t) => t.id === transaction.toolId);

            completeTransaction(transaction.id, studentName, studentId, section);

            toast.success(
                `Item borrowed successfully! Please return by ${new Date(transaction.dueDate).toLocaleTimeString()}`
            );
        } else {
            // Demo mode: No pending transaction, so create a new one
            const availableTools = tools.filter((t) => t.status === "available");

            if (availableTools.length === 0) {
                toast.error("No tools available for demo. All tools are currently borrowed.");
                return;
            }

            // Pick a random tool
            const randomTool = availableTools[Math.floor(Math.random() * availableTools.length)];

            // Pick a random instructor
            const randomInstructor = instructors[Math.floor(Math.random() * instructors.length)];

            // Calculate due date (4 hours from now)
            const dueDate = new Date();
            dueDate.setHours(dueDate.getHours() + 4);

            // Create a new transaction
            addTransaction({
                toolId: randomTool.id,
                toolName: randomTool.name,
                studentName,
                studentId,
                section,
                instructorName: randomInstructor.name,
                borrowedAt: new Date().toISOString(),
                returnedAt: null,
                status: "borrowed",
                dueDate: dueDate.toISOString(),
            });

            toast.success(`Item borrowed successfully! Please return by ${dueDate.toLocaleTimeString()}`);
        }

        // Clear form
        setTimeout(() => {
            setStudentName("");
            setStudentId("");
            setSection("");
            setTransactionId("");
            setManualMode(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
            {/* Header */}
            <div className="max-w-md mx-auto pt-4 pb-8">
                <Button variant="ghost" onClick={() => onNavigate("landing")} className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Button>

                <div className="text-center mb-8">
                    <div className="inline-flex w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl items-center justify-center mb-4 shadow-lg">
                        <QrCode className="w-9 h-9 text-white" />
                    </div>
                    <h1 className="text-blue-900 mb-2">Smart Tool Access</h1>
                    <p className="text-muted-foreground">Scan a tool's QR code to borrow or return it</p>
                </div>

                {/* QR Scanner Card */}
                {!scannedTool && !manualMode ? (
                    <Card className="shadow-2xl bg-gradient-to-br from-white to-blue-50/30 border-blue-100">
                        <CardContent className="p-8">
                            <div className="text-center space-y-6">
                                {/* QR Scanner Placeholder */}
                                <div className="w-full aspect-square bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
                                    <div className="text-center">
                                        <QrCode className="w-16 h-16 text-slate-400 mx-auto mb-3" />
                                        <p className="text-muted-foreground">Position QR code within frame</p>
                                    </div>
                                </div>

                                {/* Scan Button (Demo) */}
                                <Button
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md"
                                    size="lg"
                                    onClick={handleScan}
                                >
                                    <QrCode className="w-4 h-4 mr-2" />
                                    Simulate QR Scan (Demo)
                                </Button>

                                {/* Manual Borrow Button */}
                                <Button
                                    variant="outline"
                                    className="w-full border-blue-200 hover:bg-blue-50 hover:text-blue-900"
                                    size="lg"
                                    onClick={() => setManualMode(true)}
                                >
                                    <PackagePlus className="w-4 h-4 mr-2" />
                                    Manual Borrow Entry
                                </Button>

                                {/* Instructions */}
                                <div className="p-4 bg-blue-50 rounded-lg text-left">
                                    <h4 className="text-blue-900 mb-2">Instructions:</h4>
                                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                                        <li>Point your camera at the tool's QR code</li>
                                        <li>Wait for automatic detection</li>
                                        <li>Enter your student information</li>
                                        <li>Choose to borrow or return the tool</li>
                                        <li>Confirmation will be logged automatically</li>
                                    </ol>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : !scannedTool && manualMode ? (
                    <Card className="shadow-2xl bg-gradient-to-br from-white to-blue-50/30 border-blue-100">
                        <CardHeader>
                            <CardTitle className="text-blue-900">Manual Borrow Entry</CardTitle>
                            <CardDescription>Enter the Tracking ID from your instructor</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tracking-id">Tracking ID *</Label>
                                    <Input
                                        id="tracking-id"
                                        placeholder="e.g., TRK-123456"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        className="bg-white font-mono"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Enter the Tracking ID shown on the QR code generated by your instructor
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="manual-student-name">Full Name *</Label>
                                    <Input
                                        id="manual-student-name"
                                        placeholder="Enter your full name"
                                        value={studentName}
                                        onChange={(e) => setStudentName(e.target.value)}
                                        className="bg-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="manual-student-id">Student ID *</Label>
                                    <Input
                                        id="manual-student-id"
                                        placeholder="e.g., S-2024-XXX"
                                        value={studentId}
                                        onChange={(e) => setStudentId(e.target.value)}
                                        className="bg-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="manual-section">Section *</Label>
                                    <Select value={section} onValueChange={setSection}>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Select your section" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sections.map((sec) => (
                                                <SelectItem key={sec} value={sec}>
                                                    {sec}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <Button
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md"
                                    size="lg"
                                    onClick={handleManualBorrow}
                                >
                                    <PackagePlus className="w-4 h-4 mr-2" />
                                    Submit Borrow Request
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full hover:bg-slate-50 hover:text-slate-900"
                                    onClick={() => {
                                        setManualMode(false);
                                        setTransactionId("");
                                        setStudentName("");
                                        setStudentId("");
                                        setSection("");
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>

                            <div className="p-3 bg-blue-50 rounded-lg">
                                <p className="text-xs text-blue-900">
                                    <strong>Note:</strong> The Tracking ID automatically links the tool and instructor. All
                                    transactions are logged in real-time.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {/* Tool Information Card */}
                        <Card className="shadow-2xl bg-gradient-to-br from-white to-slate-50/50 border-slate-200">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-blue-900">{scannedTool.name}</CardTitle>
                                        <CardDescription>Tool ID: {scannedTool.id}</CardDescription>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={
                                            scannedTool.status === "available"
                                                ? "bg-green-50 text-green-700 border-green-200"
                                                : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                        }
                                    >
                                        {scannedTool.status === "available" ? (
                                            <>
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                Available
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                Borrowed
                                            </>
                                        )}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Tool Details */}
                                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Category</p>
                                        <p className="text-sm">{scannedTool.category}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Location</p>
                                        <p className="text-sm">{scannedTool.location}</p>
                                    </div>
                                    {scannedTool.instructorName && (
                                        <>
                                            <div className="col-span-2">
                                                <p className="text-xs text-muted-foreground mb-1">Instructor on Shift</p>
                                                <p className="text-sm">{scannedTool.instructorName}</p>
                                                <p className="text-xs text-blue-600">{scannedTool.instructorShift}</p>
                                            </div>
                                        </>
                                    )}
                                    {scannedTool.borrowedBy && (
                                        <>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Borrowed By</p>
                                                <p className="text-sm">{scannedTool.borrowedBy}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Time</p>
                                                <p className="text-sm">{scannedTool.borrowedAt}</p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Student Information Form - Only shown when tool is available and not yet borrowed */}
                                {scannedTool.status === "available" && (
                                    <div className="space-y-4 p-4 bg-blue-50/50 rounded-lg border border-blue-200">
                                        <h4 className="text-blue-900">Student Information</h4>
                                        <div className="space-y-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="qr-tracking-id">Tracking ID</Label>
                                                <Input
                                                    id="qr-tracking-id"
                                                    value={transactionId}
                                                    disabled
                                                    className="bg-slate-100 font-mono text-xs"
                                                />
                                                <p className="text-xs text-blue-600">Auto-detected from QR code</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="qr-instructor">Instructor on Shift</Label>
                                                <Input
                                                    id="qr-instructor"
                                                    value={scannedTool.instructorName}
                                                    disabled
                                                    className="bg-slate-100"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="student-name">Full Name *</Label>
                                                <Input
                                                    id="student-name"
                                                    placeholder="Enter your full name"
                                                    value={studentName}
                                                    onChange={(e) => setStudentName(e.target.value)}
                                                    className="bg-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="student-id">Student ID *</Label>
                                                <Input
                                                    id="student-id"
                                                    placeholder="e.g., S-2024-XXX"
                                                    value={studentId}
                                                    onChange={(e) => setStudentId(e.target.value)}
                                                    className="bg-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="section">Section *</Label>
                                                <Select value={section} onValueChange={setSection}>
                                                    <SelectTrigger className="bg-white">
                                                        <SelectValue placeholder="Select your section" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {sections.map((sec) => (
                                                            <SelectItem key={sec} value={sec}>
                                                                {sec}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    {scannedTool.status === "available" ? (
                                        <Button
                                            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md"
                                            size="lg"
                                            onClick={handleBorrow}
                                        >
                                            <PackagePlus className="w-4 h-4 mr-2" />
                                            Borrow Tool
                                        </Button>
                                    ) : (
                                        <Button
                                            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-md"
                                            size="lg"
                                            onClick={handleReturn}
                                        >
                                            <PackageMinus className="w-4 h-4 mr-2" />
                                            Return Tool
                                        </Button>
                                    )}

                                    <Button variant="outline" className="w-full" onClick={() => setScannedTool(null)}>
                                        Scan Another Tool
                                    </Button>
                                </div>

                                {/* Notice */}
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <p className="text-xs text-blue-900">
                                        <strong>Note:</strong> All transactions are automatically logged. Please return tools
                                        by the end of your session.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Success Confirmation (shown after action) */}
                        {scannedTool.borrowedBy && scannedTool.status === "borrowed" && (
                            <Card className="shadow-xl border-green-200 bg-green-50">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-green-900">Transaction Recorded</p>
                                            <p className="text-sm text-green-700">
                                                Remember to return this tool after your shift.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
