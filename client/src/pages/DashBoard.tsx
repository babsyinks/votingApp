import { useState } from "react";
import { DashboardLayout } from "features/dashboard/components/Dashboard/DashboardLayout";
import { WelcomeSection } from "features/dashboard/components/Dashboard/WelcomeSection";
import { OrganizationList } from "features/dashboard/components/Organizations/OrganizationList";
import OrgDetailsAndElectionListWrapper from "features/dashboard/components/Wrapper/OrgDetailsAndElectionListWrapper";
import { ElectionDetail } from "features/dashboard/components/Elections/ElectionDetail";
import type { Organization } from "features/dashboard/types/organization.type";
import type { Election } from "features/dashboard/types/election.type";

type View = "organizations" | "elections" | "election-detail";

const DashBoard = () => {
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);
  const [selectedElection, setSelectedElection] = useState<Election | null>(
    null,
  );
  const [currentView, setCurrentView] = useState<View>("organizations");

  const handleSelectOrganization = (org: Organization) => {
    setSelectedOrganization(org);
    setCurrentView("elections");
  };

  const handleSelectElection = (election: Election) => {
    setSelectedElection(election);
    setCurrentView("election-detail");
  };

  const handleBackToElections = () => {
    setSelectedElection(null);
    setCurrentView("elections");
  };

  return (
    <DashboardLayout>
      <WelcomeSection />

      {currentView === "organizations" && (
        <OrganizationList onSelectOrganization={handleSelectOrganization} />
      )}

      {currentView === "elections" && selectedOrganization && (
        <OrgDetailsAndElectionListWrapper
          selectedOrganization={selectedOrganization}
          handleSelectElection={handleSelectElection}
        />
      )}

      {currentView === "election-detail" && selectedElection && (
        <ElectionDetail
          election={selectedElection}
          onBack={handleBackToElections}
        />
      )}
    </DashboardLayout>
  );
};

export default DashBoard;
