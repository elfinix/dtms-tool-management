import { useState, useMemo } from "react";
import { useAppContext } from "../contexts/AppContext";
import { toast } from "sonner";

export function useToolManagement(instructorId: string) {
    const { getToolsByInstructor, addTool, updateTool, removeTool } = useAppContext();

    const [toolSearchQuery, setToolSearchQuery] = useState("");
    const [toolStatusFilter, setToolStatusFilter] = useState("all");
    const [toolConditionFilter, setToolConditionFilter] = useState("all");

    const tools = getToolsByInstructor(instructorId);

    const filteredTools = useMemo(() => {
        return tools.filter((tool) => {
            const matchesSearch =
                toolSearchQuery === "" ||
                tool.name.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
                tool.category.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
                tool.location.toLowerCase().includes(toolSearchQuery.toLowerCase());

            const matchesStatus = toolStatusFilter === "all" || tool.status === toolStatusFilter;

            const matchesCondition = toolConditionFilter === "all" || tool.condition === toolConditionFilter;

            return matchesSearch && matchesStatus && matchesCondition;
        });
    }, [tools, toolSearchQuery, toolStatusFilter, toolConditionFilter]);

    const handleAddTool = (toolData: any) => {
        if (!toolData.name || !toolData.category) {
            toast.error("Please fill in all required fields");
            return false;
        }

        addTool({
            ...toolData,
            instructorId,
            instructorName: toolData.instructorName || "Instructor",
        });

        toast.success(`Tool "${toolData.name}" added successfully`);
        return true;
    };

    const handleUpdateTool = (toolId: string, toolData: any) => {
        if (!toolData.name || !toolData.category) {
            toast.error("Please fill in all required fields");
            return false;
        }

        updateTool(toolId, toolData);
        toast.success(`Tool "${toolData.name}" updated successfully`);
        return true;
    };

    const handleDeleteTool = (toolId: string, toolName: string) => {
        removeTool(toolId);
        toast.success(`Tool "${toolName}" deleted successfully`);
    };

    return {
        tools,
        filteredTools,
        toolSearchQuery,
        setToolSearchQuery,
        toolStatusFilter,
        setToolStatusFilter,
        toolConditionFilter,
        setToolConditionFilter,
        handleAddTool,
        handleUpdateTool,
        handleDeleteTool,
    };
}
