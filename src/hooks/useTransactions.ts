import { useState, useMemo } from "react";
import { useAppContext } from "../contexts/AppContext";
import { toast } from "sonner";

export function useTransactions(instructorId?: string) {
    const {
        transactions,
        getTransactionsByInstructor,
        createPendingTransaction,
        returnTool,
        markToolAsTurnedOver,
        markAllAsTurnedOver,
    } = useAppContext();

    const [searchQuery, setSearchQuery] = useState("");
    const [dateFilter, setDateFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sectionFilter, setSectionFilter] = useState("all");

    const allTransactions = instructorId ? getTransactionsByInstructor(instructorId) : transactions;

    const filteredTransactions = useMemo(() => {
        return allTransactions.filter((transaction) => {
            const matchesSearch =
                searchQuery === "" ||
                transaction.toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.id.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;

            const matchesSection = sectionFilter === "all" || transaction.section === sectionFilter;

            const matchesDate = (() => {
                if (dateFilter === "all") return true;
                const transactionDate = new Date(transaction.borrowedAt);
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

            return matchesSearch && matchesStatus && matchesSection && matchesDate;
        });
    }, [allTransactions, searchQuery, statusFilter, sectionFilter, dateFilter]);

    const handleCreateTransaction = (toolId: string, instructorName: string, instructorId: string, quantity: number = 1) => {
        const transactionId = createPendingTransaction(toolId, instructorName, instructorId, quantity);

        if (transactionId) {
            toast.success(`Transaction ${transactionId} created successfully`);
            return transactionId;
        }

        toast.error("Failed to create transaction");
        return null;
    };

    const handleReturnTool = (transactionId: string) => {
        returnTool(transactionId);
        toast.success("Tool marked as returned and ready for turnover");
    };

    const handleTurnoverTool = (transactionId: string) => {
        markToolAsTurnedOver(transactionId);
        toast.success("Tool marked as turned over to admin");
    };

    const handleTurnoverAll = (instructorId: string) => {
        markAllAsTurnedOver(instructorId);
        toast.success("All returned tools marked as turned over to admin");
    };

    return {
        transactions: allTransactions,
        filteredTransactions,
        searchQuery,
        setSearchQuery,
        dateFilter,
        setDateFilter,
        statusFilter,
        setStatusFilter,
        sectionFilter,
        setSectionFilter,
        handleCreateTransaction,
        handleReturnTool,
        handleTurnoverTool,
        handleTurnoverAll,
    };
}
