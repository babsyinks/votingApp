import { useState } from "react";
import { Calendar, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/dashboard/components/ui/Card";
import { Button } from "@/features/dashboard/components/ui/Button";
import { Input } from "@/features/dashboard/components/ui/Input";
import { Label } from "@/features/dashboard/components/ui/Label";
import { toast } from "sonner";

interface ElectionScheduleSectionProps {
  electionId: string;
}

export const ElectionScheduleSection = ({
  electionId,
}: ElectionScheduleSectionProps) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [schedule, setSchedule] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      toast.error("End date must be after start date");
      return;
    }

    setIsSubmitting(true);

    // TODO: Send to backend
    setTimeout(() => {
      setSchedule({ startDate, endDate });
      toast.success("Election schedule set successfully!");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Set Election Schedule
        </CardTitle>
        <CardDescription>
          Define when your election will start and end
        </CardDescription>
      </CardHeader>
      <CardContent>
        {schedule ? (
          <div className="p-4 rounded-lg bg-accent/50 border border-border">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                <p className="font-semibold">
                  {new Date(schedule.startDate).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">End Date</p>
                <p className="font-semibold">
                  {new Date(schedule.endDate).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date & Time *</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date & Time *</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isSubmitting ? "Setting Schedule..." : "Set Schedule"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
