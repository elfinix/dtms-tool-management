import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CheckCircle2, Clock } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface BorrowedTool {
  transactionId: string;
  toolId: string;
  toolName: string;
  studentName: string;
  studentId: string;
  section: string;
  borrowedTime: string;
  dueTime: string;
  quantity: number;
  image: string;
}

interface BorrowedToolsTableProps {
  tools: BorrowedTool[];
  onReturn: (transactionId: string) => void;
}

export function BorrowedToolsTable({ tools, onReturn }: BorrowedToolsTableProps) {
  if (tools.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <p className="text-muted-foreground">No tools currently borrowed</p>
        <p className="text-sm text-muted-foreground mt-2">
          All tools have been returned or are available
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>Tool</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Borrowed</TableHead>
            <TableHead>Due Time</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tools.map((tool) => (
            <TableRow key={tool.transactionId} className="hover:bg-slate-50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <ImageWithFallback
                    src={tool.image}
                    alt={tool.toolName}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <p>{tool.toolName}</p>
                    <p className="text-xs text-muted-foreground">{tool.toolId}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p>{tool.studentName}</p>
                  <p className="text-xs text-muted-foreground">{tool.studentId}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-blue-50 text-blue-900">
                  {tool.section}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{tool.borrowedTime}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-amber-700">{tool.dueTime}</span>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{tool.quantity}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  onClick={() => onReturn(tool.transactionId)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Return
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
