import { Input } from "@/features/dashboard/components/ui/Input";
import { Label } from "@/features/dashboard/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/dashboard/components/ui/Select";
import { Textarea } from "@/features/dashboard/components/ui/Textarea";
import { UserPlus, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/features/dashboard/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/dashboard/components/ui/Card";

interface Contestant {
  id: string;
  surname: string;
  firstname: string;
  position: string;
  manifesto: string;
  picture?: string;
}

interface ContestantsSectionProps {
  electionId: string;
  availablePositions: string[];
}

export const ContestantsSection = ({
  electionId,
  availablePositions,
}: ContestantsSectionProps) => {
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [surname, setSurname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [position, setPosition] = useState("");
  const [manifesto, setManifesto] = useState("");
  const [picture, setPicture] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!surname.trim() || !firstname.trim() || !position.trim()) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Check if positions have been added
    if (availablePositions.length === 0) {
      toast.error("Please add positions first before creating contestants");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    // TODO: Send to backend
    setTimeout(() => {
      const newContestant: Contestant = {
        id: Math.random().toString(36).substr(2, 9),
        surname,
        firstname,
        position,
        manifesto,
        picture: picture ? URL.createObjectURL(picture) : undefined,
      };

      setContestants([...contestants, newContestant]);
      toast.success("Contestant added successfully!");

      // Reset form
      setSurname("");
      setFirstname("");
      setPosition("");
      setManifesto("");
      setPicture(null);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-primary" />
          Create Contestants
        </CardTitle>
        <CardDescription>
          Add contestants who will participate in this election
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-4 rounded-lg border border-dashed border-border"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="surname">Surname *</Label>
              <Input
                id="surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="Enter surname"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstname">Firstname *</Label>
              <Input
                id="firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="Enter firstname"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position *</Label>
            {availablePositions.length === 0 ? (
              <div className="text-sm text-muted-foreground p-3 border border-dashed rounded-md">
                Please add positions first in the "Manage Election Positions"
                section above
              </div>
            ) : (
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a position" />
                </SelectTrigger>
                <SelectContent>
                  {availablePositions.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="manifesto">Manifesto</Label>
            <Textarea
              id="manifesto"
              value={manifesto}
              onChange={(e) => setManifesto(e.target.value)}
              placeholder="Enter candidate's manifesto"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="picture">Picture</Label>
            <Input
              id="picture"
              type="file"
              accept="image/*"
              onChange={(e) => setPicture(e.target.files?.[0] || null)}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-primary/80"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {isSubmitting ? "Adding..." : "Add Contestant"}
          </Button>
        </form>

        {contestants.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Added Contestants ({contestants.length})
            </h3>
            <div className="grid gap-3">
              {contestants.map((contestant) => (
                <div
                  key={contestant.id}
                  className="p-4 rounded-lg border border-border bg-card flex items-center gap-4"
                >
                  {contestant.picture && (
                    <img
                      src={contestant.picture}
                      alt={`${contestant.firstname} ${contestant.surname}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">
                      {contestant.firstname} {contestant.surname}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {contestant.position}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
