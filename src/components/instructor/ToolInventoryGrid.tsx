import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Edit, Trash2, Package } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface Tool {
  id: string;
  name: string;
  category: string;
  location: string;
  condition: "good" | "fair" | "needs-repair";
  status: "available" | "unavailable";
  totalQty: number;
  availableQty: number;
  image?: string;
}

interface ToolInventoryGridProps {
  tools: Tool[];
  onEdit: (tool: Tool) => void;
  onDelete: (tool: Tool) => void;
}

export function ToolInventoryGrid({ tools, onEdit, onDelete }: ToolInventoryGridProps) {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "good":
        return "bg-green-100 text-green-900";
      case "fair":
        return "bg-amber-100 text-amber-900";
      case "needs-repair":
        return "bg-red-100 text-red-900";
      default:
        return "bg-slate-100 text-slate-900";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "available"
      ? "bg-green-100 text-green-900"
      : "bg-slate-100 text-slate-900";
  };

  if (tools.length === 0) {
    return (
      <Card className="bg-slate-50 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No tools found</p>
          <p className="text-sm text-muted-foreground">Add tools to your inventory to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tools.map((tool) => (
        <Card
          key={tool.id}
          className="overflow-hidden hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-slate-50 border-slate-200"
        >
          <div className="relative h-40 bg-slate-100">
            <ImageWithFallback
              src={
                tool.image ||
                "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400"
              }
              alt={tool.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Badge className={getStatusColor(tool.status)}>
                {tool.status === "available" ? "Available" : "Unavailable"}
              </Badge>
            </div>
          </div>

          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <h3 className="text-blue-900 mb-1 line-clamp-1">{tool.name}</h3>
                <p className="text-sm text-muted-foreground">{tool.category}</p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Quantity:</span>
                <span className="text-blue-900">
                  {tool.availableQty} / {tool.totalQty}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Location:</span>
                <span className="text-blue-900">{tool.location}</span>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="outline" className={getConditionColor(tool.condition)}>
                  {tool.condition === "needs-repair"
                    ? "Needs Repair"
                    : tool.condition.charAt(0).toUpperCase() + tool.condition.slice(1)}
                </Badge>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onEdit(tool)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(tool)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
