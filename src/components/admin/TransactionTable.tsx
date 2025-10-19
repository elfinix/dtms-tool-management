import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";

interface Transaction {
    id: string;
    toolName: string;
    studentName: string;
    studentId: string;
    instructorName: string;
    status: string;
    borrowedAt: string;
    returnedAt?: string;
    turnedOverAt?: string;
}

interface TransactionTableProps {
    transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
    const getStatusBadge = (status: string) => {
        const statusConfig = {
            borrowed: { color: "bg-amber-100 text-amber-900", label: "Borrowed" },
            returned: { color: "bg-green-100 text-green-900", label: "Returned" },
            "turned-over": { color: "bg-purple-100 text-purple-900", label: "Turned Over" },
            pending: { color: "bg-blue-100 text-blue-900", label: "Pending" },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || {
            color: "bg-slate-100 text-slate-900",
            label: status,
        };

        return (
            <Badge variant="outline" className={config.color}>
                {config.label}
            </Badge>
        );
    };

    return (
        <div className="rounded-lg border border-slate-200 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50">
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Tool</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Instructor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                No transactions found
                            </TableCell>
                        </TableRow>
                    ) : (
                        transactions.map((transaction) => (
                            <TableRow key={transaction.id} className="hover:bg-slate-50">
                                <TableCell className="font-mono text-xs">{transaction.id}</TableCell>
                                <TableCell>{transaction.toolName}</TableCell>
                                <TableCell>
                                    <div>
                                        <p>{transaction.studentName}</p>
                                        <p className="text-xs text-muted-foreground">{transaction.studentId}</p>
                                    </div>
                                </TableCell>
                                <TableCell>{transaction.instructorName}</TableCell>
                                <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        <p>{new Date(transaction.borrowedAt).toLocaleDateString()}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(transaction.borrowedAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
