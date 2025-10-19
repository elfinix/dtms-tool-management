import { useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { CheckCircle2, Clock, User, ChevronDown } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export interface StudentTool {
  transactionId: string;
  toolId: string;
  toolName: string;
  borrowedTime?: string;
  returnedAt?: string;
  dueTime?: string;
  quantity: number;
  image?: string;
  status?: string;
}

export interface GroupedStudent {
  studentId: string;
  studentName: string;
  section: string;
  tools: StudentTool[];
  totalTools: number;
}

interface StudentToolsGroupProps {
  students: GroupedStudent[];
  mode: "return" | "turnover";
  onActionSingle: (transactionId: string) => void;
  onActionAll: (studentId: string, transactionIds: string[]) => void;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
}

export function StudentToolsGroup({
  students,
  mode,
  onActionSingle,
  onActionAll,
  emptyMessage,
  emptyIcon,
}: StudentToolsGroupProps) {
  const [expandedStudents, setExpandedStudents] = useState<string[]>([]);

  if (students.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
        {emptyIcon || <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />}
        <p className="text-muted-foreground">
          {emptyMessage || `No tools ready for ${mode === "return" ? "return" : "turnover"}`}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {mode === "return" 
            ? "All tools have been returned or are available"
            : "No returned tools awaiting turnover to admin"
          }
        </p>
      </div>
    );
  }

  const actionLabel = mode === "return" ? "Return" : "Mark as Turned Over";
  const actionAllLabel = mode === "return" ? "Return All" : "Turnover All";
  const actionColor = mode === "return" 
    ? "bg-green-600 hover:bg-green-700" 
    : "bg-purple-600 hover:bg-purple-700";

  return (
    <div className="space-y-4">
      <Accordion type="multiple" value={expandedStudents} onValueChange={setExpandedStudents}>
        {students.map((student) => (
          <AccordionItem 
            key={student.studentId} 
            value={student.studentId}
            className="border border-slate-200 rounded-lg mb-3 overflow-hidden"
          >
            <Card className="border-0 shadow-none">
              <AccordionTrigger className="hover:no-underline px-6 py-4 hover:bg-slate-50">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-700" />
                    </div>
                    <div className="text-left">
                      <p className="text-slate-900">{student.studentName}</p>
                      <p className="text-sm text-slate-500">{student.studentId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {student.section}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={
                        mode === "return"
                          ? "bg-orange-50 text-orange-700 border-orange-200"
                          : "bg-green-50 text-green-700 border-green-200"
                      }
                    >
                      {student.totalTools} {student.totalTools === 1 ? "tool" : "tools"}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onActionAll(
                          student.studentId,
                          student.tools.map(t => t.transactionId)
                        );
                      }}
                      className={actionColor}
                    >
                      {actionAllLabel}
                    </Button>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 border-slate-200">
                        <TableHead className="text-slate-600">Tool</TableHead>
                        {mode === "return" && (
                          <>
                            <TableHead className="text-slate-600">Borrowed</TableHead>
                            <TableHead className="text-slate-600">Due Time</TableHead>
                          </>
                        )}
                        {mode === "turnover" && (
                          <TableHead className="text-slate-600">Returned At</TableHead>
                        )}
                        <TableHead className="text-slate-600">Qty</TableHead>
                        <TableHead className="text-right text-slate-600">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {student.tools.map((tool) => (
                        <TableRow key={tool.transactionId} className="border-slate-100">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {tool.image && (
                                <ImageWithFallback
                                  src={tool.image}
                                  alt={tool.toolName}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              )}
                              <div>
                                <p className="text-slate-900">{tool.toolName}</p>
                                <p className="text-xs text-slate-500">{tool.toolId}</p>
                              </div>
                            </div>
                          </TableCell>
                          {mode === "return" && (
                            <>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-slate-400" />
                                  <span className="text-sm text-slate-600">{tool.borrowedTime}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-amber-700">{tool.dueTime}</span>
                              </TableCell>
                            </>
                          )}
                          {mode === "turnover" && (
                            <TableCell>
                              <span className="text-sm text-slate-600">
                                {tool.returnedAt ? new Date(tool.returnedAt).toLocaleString() : "-"}
                              </span>
                            </TableCell>
                          )}
                          <TableCell>
                            <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                              {tool.quantity}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              onClick={() => onActionSingle(tool.transactionId)}
                              className={actionColor}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              {actionLabel}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
