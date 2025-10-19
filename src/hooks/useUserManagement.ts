import { useState, useMemo } from "react";
import { useAppContext } from "../contexts/AppContext";
import { toast } from "sonner";

export function useUserManagement() {
    const { users, addUser, updateUser, removeUser } = useAppContext();

    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch =
                searchQuery === "" ||
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.id.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesRole = roleFilter === "all" || user.role === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [users, searchQuery, roleFilter]);

    const handleAddUser = (userData: { name: string; role: "Instructor" | "Admin"; email: string }) => {
        if (!userData.name || !userData.role || !userData.email) {
            toast.error("Please fill in all required fields");
            return false;
        }

        addUser(userData);
        toast.success(`${userData.role} account created for ${userData.name}`);
        return true;
    };

    const handleUpdateUser = (
        userId: string,
        userData: {
            name: string;
            role: "Instructor" | "Admin";
            email: string;
        }
    ) => {
        if (!userData.name || !userData.role || !userData.email) {
            toast.error("Please fill in all required fields");
            return false;
        }

        updateUser(userId, userData);
        toast.success(`User ${userData.name} updated successfully`);
        return true;
    };

    const handleDeleteUser = (userId: string, userName: string) => {
        removeUser(userId);
        toast.success(`User ${userName} has been removed from the system`);
    };

    return {
        users,
        filteredUsers,
        searchQuery,
        setSearchQuery,
        roleFilter,
        setRoleFilter,
        handleAddUser,
        handleUpdateUser,
        handleDeleteUser,
    };
}
