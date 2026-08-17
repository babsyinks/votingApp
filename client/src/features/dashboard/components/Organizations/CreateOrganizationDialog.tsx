import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/features/dashboard/components/ui/Dialog";
import { Button } from "@/features/dashboard/components/ui/Button";
import { Textarea } from "@/features/dashboard/components/ui/Textarea";
import { Input } from "@/features/dashboard/components/ui/Input";
import { Label } from "@/features/dashboard/components/ui/Label";
import { toast } from "sonner";

interface CreateOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateOrganization: (org: {
    id: string;
    name: string;
    description: string;
  }) => void;
}

export const CreateOrganizationDialog = ({
  open,
  onOpenChange,
  onCreateOrganization,
}: CreateOrganizationDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter an organization name");
      return;
    }

    setIsSubmitting(true);

    // TODO: Send to backend
    setTimeout(() => {
      const newOrg = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        description,
      };

      onCreateOrganization(newOrg);
      toast.success("Organization created successfully!");
      setName("");
      setDescription("");
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] dash">
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
          <DialogDescription>
            Enter the details for your new organization
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter organization name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your organization"
              rows={4}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-primary to-primary/80"
            >
              {isSubmitting ? "Creating..." : "Create Organization"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
