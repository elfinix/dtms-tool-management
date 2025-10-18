import { createContext, useContext, useState, ReactNode } from "react";

export interface Tool {
  id: string;
  name: string;
  category: string;
  location: string;
  image: string;
  totalQty: number;
  availableQty: number;
  status: "available" | "unavailable";
  condition: "good" | "fair" | "needs-repair";
  instructorId: string; // Tool belongs to specific instructor
}

export interface Transaction {
  id: string;
  toolId: string;
  toolName: string;
  studentName: string;
  studentId: string;
  section: string;
  instructorName: string;
  instructorId: string;
  borrowedAt: string;
  returnedAt: string | null;
  turnedOverAt: string | null; // When instructor marks as turned over
  status: "pending" | "borrowed" | "returned" | "turned-over";
  dueDate: string;
  quantity: number; // Number of items in this transaction
}

export interface Borrower {
  name: string;
  id: string;
  course: string;
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  toolStatus: "no-tools" | "tools-in-use" | "all-turned-over";
  shiftEndTime: string; // Time when instructor's shift ends (HH:mm format)
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Instructor" | "Admin";
  status: "active" | "inactive";
  joinDate: string;
  toolStatus?: "no-tools" | "tools-in-use" | "all-turned-over";
}

interface AppContextType {
  tools: Tool[];
  transactions: Transaction[];
  borrowers: Borrower[];
  instructors: Instructor[];
  users: User[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  createPendingTransaction: (toolId: string, instructorName: string, instructorId: string, quantity: number) => string;
  completeTransaction: (transactionId: string, studentName: string, studentId: string, section: string) => void;
  returnTool: (transactionId: string) => void;
  markToolAsTurnedOver: (transactionId: string) => void;
  markAllAsTurnedOver: (instructorId: string) => void;
  updateToolStatus: (toolId: string, updates: Partial<Tool>) => void;
  addBorrower: (borrower: Borrower) => void;
  getTransactionById: (transactionId: string) => Transaction | undefined;
  getToolsByInstructor: (instructorId: string) => Tool[];
  getTransactionsByInstructor: (instructorId: string) => Transaction[];
  getReturnedToolsByInstructor: (instructorId: string) => Transaction[];
  addTool: (tool: Omit<Tool, "id">) => void;
  updateTool: (toolId: string, updatedTool: Partial<Tool>) => void;
  removeTool: (toolId: string) => void;
  updateInstructorToolStatus: (instructorId: string) => void;
  updateInstructorShiftTime: (instructorId: string, shiftEndTime: string) => void;
  getInstructorById: (instructorId: string) => Instructor | undefined;
  addUser: (user: Omit<User, "id" | "joinDate" | "status">) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  removeUser: (userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial mock instructors
const initialInstructors: Instructor[] = [
  { id: "I-001", name: "Prof. Richard Anderson", email: "r.anderson@dpraviation.edu", toolStatus: "tools-in-use", shiftEndTime: "14:00" },
  { id: "I-002", name: "Dr. Sarah Mitchell", email: "s.mitchell@dpraviation.edu", toolStatus: "all-turned-over", shiftEndTime: "20:00" },
  { id: "I-003", name: "Eng. Michael Torres", email: "m.torres@dpraviation.edu", toolStatus: "no-tools", shiftEndTime: "16:00" },
];

// Initial mock data - tools now belong to instructors
const initialTools: Tool[] = [
  { id: "T-001", name: "Torque Wrench", category: "Hand Tools", location: "Cabinet A1", image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400", totalQty: 5, availableQty: 3, status: "available", condition: "good", instructorId: "I-001" },
  { id: "T-002", name: "Digital Multimeter", category: "Testing Equipment", location: "Cabinet B2", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400", totalQty: 10, availableQty: 10, status: "available", condition: "good", instructorId: "I-001" },
  { id: "T-003", name: "Socket Set (42pc)", category: "Hand Tools", location: "Cabinet A3", image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400", totalQty: 8, availableQty: 6, status: "available", condition: "good", instructorId: "I-001" },
  { id: "T-004", name: "Wire Stripper", category: "Hand Tools", location: "Cabinet C1", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400", totalQty: 15, availableQty: 15, status: "available", condition: "good", instructorId: "I-002" },
  { id: "T-005", name: "Cordless Drill Set", category: "Power Tools", location: "Cabinet D2", image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400", totalQty: 3, availableQty: 3, status: "available", condition: "good", instructorId: "I-002" },
  { id: "T-006", name: "Safety Wire Pliers", category: "Hand Tools", location: "Cabinet A2", image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400", totalQty: 12, availableQty: 12, status: "available", condition: "good", instructorId: "I-001" },
  { id: "T-007", name: "Rivet Gun", category: "Hand Tools", location: "Cabinet C3", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400", totalQty: 4, availableQty: 4, status: "available", condition: "good", instructorId: "I-001" },
  { id: "T-008", name: "Micrometer Set", category: "Measuring Tools", location: "Cabinet B1", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400", totalQty: 6, availableQty: 6, status: "available", condition: "good", instructorId: "I-002" },
  { id: "T-009", name: "Inspection Mirror", category: "Hand Tools", location: "Cabinet A4", image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400", totalQty: 20, availableQty: 20, status: "available", condition: "good", instructorId: "I-001" },
  { id: "T-010", name: "Aviation Snips", category: "Hand Tools", location: "Cabinet C2", image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400", totalQty: 10, availableQty: 10, status: "available", condition: "good", instructorId: "I-001" },
];

// Sample initial data
const initialTransactions: Transaction[] = [
  {
    id: "TRK-001234",
    toolId: "T-001",
    toolName: "Torque Wrench",
    studentName: "John Michael Smith",
    studentId: "S-2024-001",
    section: "AMT-1A",
    instructorName: "Prof. Richard Anderson",
    instructorId: "I-001",
    borrowedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    returnedAt: null,
    turnedOverAt: null,
    status: "borrowed",
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    quantity: 2,
  },
  {
    id: "TRK-001235",
    toolId: "T-003",
    toolName: "Socket Set (42pc)",
    studentName: "Sarah Mae Johnson",
    studentId: "S-2024-023",
    section: "AMT-2B",
    instructorName: "Prof. Richard Anderson",
    instructorId: "I-001",
    borrowedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    returnedAt: null,
    turnedOverAt: null,
    status: "borrowed",
    dueDate: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(),
    quantity: 2,
  },
  {
    id: "TRK-001236",
    toolId: "T-004",
    toolName: "Wire Stripper",
    studentName: "Michael Davis Chen",
    studentId: "S-2024-045",
    section: "AMT-1B",
    instructorName: "Dr. Sarah Mitchell",
    instructorId: "I-002",
    borrowedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    returnedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    turnedOverAt: new Date(Date.now() - 0.5 * 60 * 60 * 1000).toISOString(),
    status: "turned-over",
    dueDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    quantity: 1,
  },
  {
    id: "TRK-001237",
    toolId: "T-005",
    toolName: "Cordless Drill Set",
    studentName: "Emily Rose Brown",
    studentId: "S-2024-067",
    section: "AMT-1C",
    instructorName: "Dr. Sarah Mitchell",
    instructorId: "I-002",
    borrowedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    returnedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    turnedOverAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    status: "turned-over",
    dueDate: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    quantity: 1,
  },
];

const initialBorrowers: Borrower[] = [
  { name: "John Michael Smith", id: "S-2024-001", course: "AMT-3A" },
  { name: "Sarah Mae Johnson", id: "S-2024-023", course: "AMT-2B" },
  { name: "Michael Davis Chen", id: "S-2024-045", course: "AMT-3A" },
  { name: "Emily Rose Brown", id: "S-2024-067", course: "AMT-1A" },
];

// Initial users (instructors and admins)
const initialUsers: User[] = [
  { id: "U-001", name: "Prof. Richard Anderson", email: "r.anderson@dpraviation.edu", role: "Instructor", status: "active", joinDate: "2023-01-15", toolStatus: "tools-in-use" },
  { id: "U-002", name: "Dr. Sarah Mitchell", email: "s.mitchell@dpraviation.edu", role: "Instructor", status: "active", joinDate: "2023-03-22", toolStatus: "all-turned-over" },
  { id: "U-003", name: "Eng. Michael Torres", email: "m.torres@dpraviation.edu", role: "Instructor", status: "active", joinDate: "2023-05-10", toolStatus: "no-tools" },
  { id: "U-004", name: "Dr. Jennifer Lee", email: "j.lee@dpraviation.edu", role: "Instructor", status: "active", joinDate: "2023-07-18", toolStatus: "tools-in-use" },
  { id: "U-005", name: "Prof. David Chen", email: "d.chen@dpraviation.edu", role: "Instructor", status: "active", joinDate: "2023-09-05", toolStatus: "all-turned-over" },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [borrowers, setBorrowers] = useState<Borrower[]>(initialBorrowers);
  const [instructors, setInstructors] = useState<Instructor[]>(initialInstructors);
  const [users, setUsers] = useState<User[]>(initialUsers);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `TRK-${Date.now().toString().slice(-6)}`,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const createPendingTransaction = (toolId: string, instructorName: string, instructorId: string, quantity: number): string => {
    const tool = tools.find((t) => t.id === toolId);
    if (!tool || tool.availableQty < quantity) return "";
    
    // Get instructor's shift end time
    const instructor = instructors.find((i) => i.id === instructorId);
    const shiftEndTime = instructor?.shiftEndTime || "14:00";
    
    // Set due date to today at shift end time
    const dueDate = new Date();
    const [hours, minutes] = shiftEndTime.split(':');
    dueDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const newTransaction: Transaction = {
      id: `TRK-${Date.now().toString().slice(-6)}`,
      toolId,
      toolName: tool.name,
      studentName: "",
      studentId: "",
      section: "",
      instructorName,
      instructorId,
      borrowedAt: new Date().toISOString(),
      returnedAt: null,
      turnedOverAt: null,
      status: "pending",
      dueDate: dueDate.toISOString(),
      quantity,
    };
    
    setTransactions((prev) => [newTransaction, ...prev]);
    
    // Decrease available quantity
    setTools((prev) =>
      prev.map((t) =>
        t.id === toolId ? { ...t, availableQty: t.availableQty - quantity } : t
      )
    );
    
    return newTransaction.id;
  };

  const completeTransaction = (transactionId: string, studentName: string, studentId: string, section: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId
          ? { ...t, studentName, studentId, section, status: "borrowed" as const, borrowedAt: new Date().toISOString() }
          : t
      )
    );
    
    // Add borrower
    addBorrower({
      name: studentName,
      id: studentId,
      course: section,
    });
  };

  const returnTool = (transactionId: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId
          ? { ...t, returnedAt: new Date().toISOString(), status: "returned" as const }
          : t
      )
    );
    
    // Increase available quantity
    const transaction = transactions.find((t) => t.id === transactionId);
    if (transaction) {
      setTools((prev) =>
        prev.map((tool) =>
          tool.id === transaction.toolId
            ? { ...tool, availableQty: tool.availableQty + transaction.quantity }
            : tool
        )
      );
    }
  };

  const markToolAsTurnedOver = (transactionId: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId
          ? { ...t, turnedOverAt: new Date().toISOString(), status: "turned-over" as const }
          : t
      )
    );
    
    // Update instructor status
    const transaction = transactions.find((t) => t.id === transactionId);
    if (transaction) {
      updateInstructorToolStatus(transaction.instructorId);
    }
  };

  const markAllAsTurnedOver = (instructorId: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.instructorId === instructorId && t.status === "returned"
          ? { ...t, turnedOverAt: new Date().toISOString(), status: "turned-over" as const }
          : t
      )
    );
    
    updateInstructorToolStatus(instructorId);
  };

  const updateInstructorToolStatus = (instructorId: string) => {
    const instructorTransactions = transactions.filter((t) => t.instructorId === instructorId);
    const hasActiveTransactions = instructorTransactions.some((t) => 
      t.status === "borrowed" || t.status === "pending" || t.status === "returned"
    );
    
    setInstructors((prev) =>
      prev.map((inst) =>
        inst.id === instructorId
          ? { ...inst, toolStatus: hasActiveTransactions ? "tools-in-use" : instructorTransactions.length > 0 ? "all-turned-over" : "no-tools" }
          : inst
      )
    );
  };

  const updateToolStatus = (toolId: string, updates: Partial<Tool>) => {
    setTools((prev) =>
      prev.map((tool) => (tool.id === toolId ? { ...tool, ...updates } : tool))
    );
  };

  const addBorrower = (borrower: Borrower) => {
    setBorrowers((prev) => {
      const exists = prev.some((b) => b.id === borrower.id);
      if (exists) return prev;
      return [borrower, ...prev];
    });
  };

  const getTransactionById = (transactionId: string): Transaction | undefined => {
    return transactions.find((t) => t.id === transactionId);
  };

  const getToolsByInstructor = (instructorId: string): Tool[] => {
    return tools.filter((t) => t.instructorId === instructorId);
  };

  const getTransactionsByInstructor = (instructorId: string): Transaction[] => {
    return transactions.filter((t) => t.instructorId === instructorId);
  };

  const getReturnedToolsByInstructor = (instructorId: string): Transaction[] => {
    return transactions.filter((t) => t.instructorId === instructorId && t.status === "returned");
  };

  const addTool = (tool: Omit<Tool, "id">) => {
    const newTool: Tool = {
      ...tool,
      id: `T-${(tools.length + 1).toString().padStart(3, "0")}`,
    };
    setTools((prev) => [...prev, newTool]);
  };

  const updateTool = (toolId: string, updatedTool: Partial<Tool>) => {
    setTools((prev) =>
      prev.map((tool) =>
        tool.id === toolId ? { ...tool, ...updatedTool } : tool
      )
    );
  };

  const removeTool = (toolId: string) => {
    setTools((prev) => prev.filter((tool) => tool.id !== toolId));
  };

  const updateInstructorShiftTime = (instructorId: string, shiftEndTime: string) => {
    // Update instructor shift time
    setInstructors((prev) =>
      prev.map((instructor) =>
        instructor.id === instructorId ? { ...instructor, shiftEndTime } : instructor
      )
    );

    // Update due dates for all borrowed/returned transactions
    setTransactions((prev) =>
      prev.map((transaction) => {
        if (transaction.instructorId === instructorId && 
            (transaction.status === "borrowed" || transaction.status === "returned")) {
          // Calculate new due date based on borrowed date and new shift end time
          const borrowedDate = new Date(transaction.borrowedAt);
          const [hours, minutes] = shiftEndTime.split(':');
          const newDueDate = new Date(borrowedDate);
          newDueDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          
          return { ...transaction, dueDate: newDueDate.toISOString() };
        }
        return transaction;
      })
    );
  };

  const getInstructorById = (instructorId: string): Instructor | undefined => {
    return instructors.find((i) => i.id === instructorId);
  };

  const addUser = (user: Omit<User, "id" | "joinDate" | "status">) => {
    const newUser: User = {
      ...user,
      id: `U-${(users.length + 1).toString().padStart(3, "0")}`,
      joinDate: new Date().toISOString().split("T")[0],
      status: "active",
      toolStatus: user.role === "Instructor" ? "no-tools" : undefined,
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, ...updates } : user))
    );
  };

  const removeUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  return (
    <AppContext.Provider
      value={{
        tools,
        transactions,
        borrowers,
        instructors,
        users,
        addTransaction,
        createPendingTransaction,
        completeTransaction,
        returnTool,
        markToolAsTurnedOver,
        markAllAsTurnedOver,
        updateToolStatus,
        addBorrower,
        getTransactionById,
        getToolsByInstructor,
        getTransactionsByInstructor,
        getReturnedToolsByInstructor,
        addTool,
        updateTool,
        removeTool,
        updateInstructorToolStatus,
        updateInstructorShiftTime,
        getInstructorById,
        addUser,
        updateUser,
        removeUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
