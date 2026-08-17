import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/features/dashboard/components/ui/Dialog";
import { Button } from "@/features/dashboard/components/ui/Button";
import { Input } from "@/features/dashboard/components/ui/Input";
import { Label } from "@/features/dashboard/components/ui/Label";
import { toast } from "sonner";

interface CreateElectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateElection: (election: {
    id: string;
    name: string;
    status: "upcoming" | "ongoing" | "concluded";
  }) => void;
}

export const CreateElectionDialog = ({
  open,
  onOpenChange,
  onCreateElection,
}: CreateElectionDialogProps) => {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter an election name");
      return;
    }

    setIsSubmitting(true);

    // TODO: Send to backend
    setTimeout(() => {
      const newElection = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        status: "upcoming" as const,
      };

      onCreateElection(newElection);
      toast.success("Election created successfully!");
      setName("");
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] dash">
        <DialogHeader>
          <DialogTitle>Create New Election</DialogTitle>
          <DialogDescription>
            Enter the name for your new election
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Election Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter election name"
              required
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
              {isSubmitting ? "Creating..." : "Create Election"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
