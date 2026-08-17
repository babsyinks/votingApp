import type { Organization } from "features/dashboard/types/organization.type";

const SelectedOrganizationDetails = ({
  selectedOrganization,
}: {
  selectedOrganization: Organization;
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 mt-0">{selectedOrganization.name}</h2>
      <p className="text-muted-foreground">
        {selectedOrganization.description ||
          "Manage elections for this organization"}
      </p>
    </div>
  );
};

export default SelectedOrganizationDetails;
