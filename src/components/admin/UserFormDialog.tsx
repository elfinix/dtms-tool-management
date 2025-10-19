import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";

interface UserFormData {
  name: string;
  email: string;
  role: string;
}

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  userData: UserFormData;
  onUserDataChange: (data: UserFormData) => void;
  onSubmit: () => void;
  submitLabel?: string;
}

export function UserFormDialog({
  open,
  onOpenChange,
  title,
  description,
  userData,
  onUserDataChange,
  onSubmit,
  submitLabel = "Save",
}: UserFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={userData.name}
              onChange={(e) => onUserDataChange({ ...userData, name: e.target.value })}
              placeholder="e.g., John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={userData.email}
              onChange={(e) => onUserDataChange({ ...userData, email: e.target.value })}
              placeholder="e.g., john.doe@dpraviation.edu"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select
              value={userData.role}
              onValueChange={(value) => onUserDataChange({ ...userData, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Instructor">Instructor</SelectItem>
              </SelectContent>
            </Select>
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
