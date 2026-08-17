import { Button } from "@/features/dashboard/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/dashboard/components/ui/Card";
import {
  Vote,
  Plus,
  ChevronRight,
  Calendar,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect } from "react";

import { CreateElectionDialog } from "./CreateElectionDialog";

import { Badge } from "@/features/dashboard/components/ui/Badge";

interface Election {
  id: string;
  name: string;
  status: "upcoming" | "ongoing" | "concluded";
  startDate?: string;
  endDate?: string;
}

interface ElectionListProps {
  organizationId: string;
  onSelectElection: (election: Election) => void;
}

export const ElectionList = ({
  organizationId,
  onSelectElection,
}: ElectionListProps) => {
  const [elections, setElections] = useState<Election[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch elections from backend
    setTimeout(() => {
      setElections([]);
      setIsLoading(false);
    }, 1000);
  }, [organizationId]);

  const handleCreateElection = (election: Election) => {
    setElections([...elections, election]);
    setIsCreateDialogOpen(false);
  };

  const getStatusBadge = (status: Election["status"]) => {
    const config = {
      upcoming: {
        label: "Upcoming",
        className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      },
      ongoing: {
        label: "Ongoing",
        className: "bg-green-500/10 text-green-500 border-green-500/20",
      },
      concluded: {
        label: "Concluded",
        className: "bg-gray-500/10 text-gray-500 border-gray-500/20",
      },
    };

    return (
      <Badge variant="outline" className={config[status].className}>
        {config[status].label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-2/3 mt-2"></div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="w-5 h-5 text-primary" />
            Your Elections
          </CardTitle>
          <CardDescription>
            {elections.length === 0
              ? "No elections found. Create one to get started!"
              : `You have ${elections.length} election${elections.length > 1 ? "s" : ""}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {elections.length > 0 ? (
            <div className="space-y-3">
              {elections.map((election) => (
                <button
                  key={election.id}
                  onClick={() => onSelectElection(election)}
                  className="w-full p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-all group text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {election.name}
                        </h3>
                        {getStatusBadge(election.status)}
                      </div>
                      {election.startDate && election.endDate && (
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(election.startDate).toLocaleDateString()}
                          </span>
                          <span>-</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(election.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Vote className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No elections found</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow border-dashed border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Create New Election
          </CardTitle>
          <CardDescription>
            Start a new election for your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Election
          </Button>
        </CardContent>
      </Card>

      <CreateElectionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateElection={handleCreateElection}
      />
    </div>
  );
};
