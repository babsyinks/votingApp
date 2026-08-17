import { Users, BarChart3, Calendar, Clock, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/dashboard/components/ui/Card";

interface Election {
  id: string;
  name: string;
  status: "upcoming" | "ongoing" | "concluded";
  startDate?: string;
  endDate?: string;
}

interface ElectionStatsSectionProps {
  election: Election;
  showResults: boolean;
}

export const ElectionStatsSection = ({
  election,
  showResults,
}: ElectionStatsSectionProps) => {
  // Mock data - TODO: Fetch from backend
  const stats = {
    totalVoters: 1250,
    votedCount: showResults ? 987 : 543,
    startDate: election.startDate || "2024-03-01",
    endDate: election.endDate || "2024-03-15",
    results: showResults
      ? [
          { candidate: "John Doe", position: "President", votes: 450 },
          { candidate: "Jane Smith", position: "President", votes: 387 },
          { candidate: "Mike Johnson", position: "Vice President", votes: 150 },
        ]
      : [],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Voters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {stats.totalVoters}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Votes Cast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {stats.votedCount}
            </p>
            <p className="text-sm text-muted-foreground mt-1 mb-0">
              {((stats.votedCount / stats.totalVoters) * 100).toFixed(1)}%
              turnout
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Election Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">
              {new Date(stats.startDate).toLocaleDateString()}
            </p>
            <p className="text-xs text-muted-foreground">to</p>
            <p className="text-sm font-semibold">
              {new Date(stats.endDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {showResults && stats.results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Election Results
            </CardTitle>
            <CardDescription>Final vote counts by candidate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.results.map((result, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{result.candidate}</p>
                      <p className="text-sm text-muted-foreground">
                        {result.position}
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      {result.votes}
                    </p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all"
                      style={{
                        width: `${(result.votes / stats.votedCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
