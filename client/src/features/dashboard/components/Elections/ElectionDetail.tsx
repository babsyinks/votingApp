import { Button } from "@/features/dashboard/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/dashboard/components/ui/Card";
import { ArrowLeft, Calendar, Users, BarChart3 } from "lucide-react";
import { useState } from "react";

import { ContestantsSection } from "./ContestantsSection";
import { ElectionScheduleSection } from "./ElectionScheduleSection";
import { ElectionStatsSection } from "./ElectionStatsSection";
import { PositionsSection } from "./PositionsSection";
import { VotersSection } from "./VotersSection";

interface Election {
  id: string;
  name: string;
  status: "upcoming" | "ongoing" | "concluded";
  startDate?: string;
  endDate?: string;
}

interface ElectionDetailProps {
  election: Election;
  onBack: () => void;
}

export const ElectionDetail = ({ election, onBack }: ElectionDetailProps) => {
  const isUpcoming = election.status === "upcoming";
  const isOngoing = election.status === "ongoing";
  const isConcluded = election.status === "concluded";

  // State for managing positions
  const [positions, setPositions] = useState<string[]>([]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{election.name}</h1>
          <p className="text-muted-foreground capitalize">
            {election.status} Election
          </p>
        </div>
      </div>

      {isConcluded && (
        <ElectionStatsSection election={election} showResults={true} />
      )}

      {isOngoing && (
        <ElectionStatsSection election={election} showResults={false} />
      )}

      {isUpcoming && (
        <div className="grid gap-6">
          <ElectionScheduleSection electionId={election.id} />
          <PositionsSection
            electionId={election.id}
            positions={positions}
            onPositionsChange={setPositions}
          />
          <ContestantsSection
            electionId={election.id}
            availablePositions={positions}
          />
          <VotersSection electionId={election.id} />
        </div>
      )}
    </div>
  );
};
