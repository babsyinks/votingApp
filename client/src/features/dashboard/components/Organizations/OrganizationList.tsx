import { useState, useEffect } from "react";
import { Building2, Plus, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/dashboard/components/ui/Card";
import { Button } from "@/features/dashboard/components/ui/Button";
import { CreateOrganizationDialog } from "./CreateOrganizationDialog";

interface Organization {
  id: string;
  name: string;
  description: string;
}

interface OrganizationListProps {
  onSelectOrganization: (org: Organization) => void;
}

export const OrganizationList = ({
  onSelectOrganization,
}: OrganizationListProps) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch organizations from backend
    // Simulating API call
    setTimeout(() => {
      setOrganizations([]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCreateOrganization = (org: Organization) => {
    setOrganizations([...organizations, org]);
    setIsCreateDialogOpen(false);
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
      <Card className="shadow-sm hover:shadow-md transition-shadow border-x border-y">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Your Organizations
          </CardTitle>
          <CardDescription>
            {organizations.length === 0
              ? "You don't belong to any organization yet. Create one to get started!"
              : `You belong to ${organizations.length} organization${organizations.length > 1 ? "s" : ""}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {organizations.length > 0 ? (
            <div className="space-y-3">
              {organizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => onSelectOrganization(org)}
                  className="w-full p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-all group text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {org.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-0">
                        {org.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No organizations found</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow border-dashed border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Create New Organization
          </CardTitle>
          <CardDescription>
            Start a new organization to manage your elections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Organization
          </Button>
        </CardContent>
      </Card>

      <CreateOrganizationDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateOrganization={handleCreateOrganization}
      />
    </div>
  );
};
