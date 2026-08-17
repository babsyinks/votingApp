import { Button } from "@/features/dashboard/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/dashboard/components/ui/Card";
import { Input } from "@/features/dashboard/components/ui/Input";
import { Plus, X, Edit2, Check, GripVertical } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PositionsSectionProps {
  electionId: string;
  positions: string[];
  onPositionsChange: (positions: string[]) => void;
}

const COMMON_POSITIONS = [
  "Chairman",
  "Vice Chairman",
  "President",
  "Vice President",
  "General Secretary",
  "Assistant General Secretary",
  "Treasurer",
  "Financial Secretary",
  "Social Welfare Officer",
  "Public Relations Officer",
  "Legal Adviser",
  "Internal Auditor",
  "Chief Whip",
  "Organizing Secretary",
  "Welfare Officer",
];

export const PositionsSection = ({
  electionId,
  positions,
  onPositionsChange,
}: PositionsSectionProps) => {
  const [newPosition, setNewPosition] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [draggedPosition, setDraggedPosition] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAddPosition = () => {
    const trimmedPosition = newPosition.trim();
    if (!trimmedPosition) {
      toast.error("Position name cannot be empty");
      return;
    }

    if (positions.includes(trimmedPosition)) {
      toast.error("This position already exists");
      return;
    }

    onPositionsChange([...positions, trimmedPosition]);
    setNewPosition("");
    toast.success("Position added successfully");
  };

  const handleDeletePosition = (index: number) => {
    const updatedPositions = positions.filter((_, i) => i !== index);
    onPositionsChange(updatedPositions);
    toast.success("Position removed");
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(positions[index]);
  };

  const handleSaveEdit = (index: number) => {
    const trimmedValue = editValue.trim();
    if (!trimmedValue) {
      toast.error("Position name cannot be empty");
      return;
    }

    if (positions.includes(trimmedValue) && positions[index] !== trimmedValue) {
      toast.error("This position already exists");
      return;
    }

    const updatedPositions = [...positions];
    updatedPositions[index] = trimmedValue;
    onPositionsChange(updatedPositions);
    setEditingIndex(null);
    toast.success("Position updated");
  };

  const handleDragStart = (position: string) => {
    setDraggedPosition(position);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex?: number) => {
    e.preventDefault();

    // Reordering existing positions
    if (draggedIndex !== null && dropIndex !== undefined) {
      const updatedPositions = [...positions];
      const [draggedItem] = updatedPositions.splice(draggedIndex, 1);
      updatedPositions.splice(dropIndex, 0, draggedItem);
      onPositionsChange(updatedPositions);
      setDraggedIndex(null);
      toast.success("Position reordered");
      return;
    }

    // Adding new position from common positions
    if (draggedPosition) {
      if (positions.includes(draggedPosition)) {
        toast.error("This position already exists");
      } else {
        onPositionsChange([...positions, draggedPosition]);
        toast.success("Position added successfully");
      }
      setDraggedPosition(null);
    }
  };

  const handleReorderDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  return (
    <Card className="animate-scale-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GripVertical className="w-5 h-5 text-primary" />
          Manage Election Positions
        </CardTitle>
        <CardDescription>
          Add positions manually or drag from common positions below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Manual Input Section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Add Position Manually
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter position name (e.g., Secretary)"
              value={newPosition}
              onChange={(e) => setNewPosition(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddPosition();
                }
              }}
              className="flex-1"
            />
            <Button onClick={handleAddPosition} className="gap-2">
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
        </div>

        {/* Common Positions - Draggable */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Common Positions (Drag to add)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {COMMON_POSITIONS.map((position) => (
              <div
                key={position}
                draggable
                onDragStart={() => handleDragStart(position)}
                className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-md cursor-move hover:bg-secondary/80 transition-colors group"
              >
                <GripVertical className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                <span className="text-sm">{position}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Added Positions Box */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Added Positions ({positions.length})
            </label>
            <p className="text-xs text-muted-foreground">
              The order of positions determines how contestants appear in the
              election. Drag to reorder.
            </p>
          </div>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`min-h-[120px] p-4 border-2 border-dashed rounded-lg ${
              draggedPosition
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/30"
            } transition-all`}
          >
            {positions.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                {draggedPosition
                  ? "Drop here to add position"
                  : "No positions added yet. Add manually or drag from common positions above."}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {positions.map((position, index) => (
                  <div
                    key={index}
                    draggable={editingIndex !== index}
                    onDragStart={() => handleReorderDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-md border border-primary/20 ${
                      editingIndex !== index
                        ? "cursor-move hover:bg-primary/15"
                        : ""
                    } transition-colors`}
                  >
                    {editingIndex === index ? (
                      <>
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleSaveEdit(index);
                            }
                            if (e.key === "Escape") {
                              setEditingIndex(null);
                            }
                          }}
                          className="h-6 w-32 text-sm"
                          autoFocus
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => handleSaveEdit(index)}
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <GripVertical className="w-4 h-4 opacity-50" />
                        <span className="text-sm font-medium">{position}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 hover:bg-primary/20"
                          onClick={() => handleStartEdit(index)}
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 hover:bg-destructive/20 hover:text-destructive"
                          onClick={() => handleDeletePosition(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
