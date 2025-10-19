import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ToolFormData {
  name: string;
  category: string;
  location: string;
  condition: "good" | "fair" | "needs-repair";
  status: "available" | "unavailable";
  totalQty: number;
  availableQty: number;
  image: string;
}

interface ToolFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  toolData: ToolFormData;
  onToolDataChange: (data: ToolFormData) => void;
  onSubmit: () => void;
  submitLabel?: string;
}

export function ToolFormDialog({
  open,
  onOpenChange,
  title,
  description,
  toolData,
  onToolDataChange,
  onSubmit,
  submitLabel = "Save",
}: ToolFormDialogProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onToolDataChange({ ...toolData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onToolDataChange({ ...toolData, image: "" });
  };

  const handleUsePlaceholder = () => {
    onToolDataChange({ 
      ...toolData, 
      image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400" 
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tool Name *</Label>
              <Input
                id="name"
                value={toolData.name}
                onChange={(e) => onToolDataChange({ ...toolData, name: e.target.value })}
                placeholder="e.g., Wrench Set"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={toolData.category}
                onChange={(e) => onToolDataChange({ ...toolData, category: e.target.value })}
                placeholder="e.g., Hand Tools"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={toolData.location}
              onChange={(e) => onToolDataChange({ ...toolData, location: e.target.value })}
              placeholder="e.g., Tool Room A, Shelf 3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalQty">Total Quantity *</Label>
              <Input
                id="totalQty"
                type="number"
                min="1"
                value={toolData.totalQty}
                onChange={(e) =>
                  onToolDataChange({ ...toolData, totalQty: parseInt(e.target.value) || 1 })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availableQty">Available Quantity *</Label>
              <Input
                id="availableQty"
                type="number"
                min="0"
                max={toolData.totalQty}
                value={toolData.availableQty}
                onChange={(e) =>
                  onToolDataChange({
                    ...toolData,
                    availableQty: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="condition">Condition *</Label>
              <Select
                value={toolData.condition}
                onValueChange={(value: any) =>
                  onToolDataChange({ ...toolData, condition: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="needs-repair">Needs Repair</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={toolData.status}
                onValueChange={(value: any) => onToolDataChange({ ...toolData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tool Image (optional)</Label>
            {toolData.image ? (
              <div className="space-y-3">
                <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-slate-100">
                  <ImageWithFallback
                    src={toolData.image}
                    alt="Tool preview"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Image uploaded successfully</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Label
                    htmlFor="image-upload"
                    className="flex-1 flex items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload image
                    </span>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 border-t"></div>
                  <span className="text-xs text-muted-foreground">OR</span>
                  <div className="flex-1 border-t"></div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleUsePlaceholder}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Use Default Placeholder
                </Button>
                <p className="text-xs text-muted-foreground">
                  Upload a photo of the tool or use the default placeholder image
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onSubmit}>{submitLabel}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
