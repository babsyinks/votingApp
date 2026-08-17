import type { Election } from "features/dashboard/types/election.type";
import type { Organization } from "features/dashboard/types/organization.type";

import { ElectionList } from "../Elections/ElectionList";
import SelectedOrganizationDetails from "../Organizations/SelectedOrganizationDetails";

const OrgDetailsAndElectionListWrapper = ({
  selectedOrganization,
  handleSelectElection,
}: {
  selectedOrganization: Organization;
  handleSelectElection: (election: Election) => void;
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <SelectedOrganizationDetails
        selectedOrganization={selectedOrganization}
      />
      <ElectionList
        organizationId={selectedOrganization.id}
        onSelectElection={handleSelectElection}
      />
    </div>
  );
};

export default OrgDetailsAndElectionListWrapper;
