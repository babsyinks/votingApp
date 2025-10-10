import { createOrganizationService } from "../../services/organizationService";
import { Organization } from "../../models/organization";
import { UserOrganization } from "../../models/userOrganization";
import { Election } from "../../models/election";

jest.mock("../../models", () => ({
  sequelize: {
    transaction: jest.fn((cb: any) => cb({})),
  },
}));

describe("organizationService", () => {
  let OrganizationModel: jest.Mocked<typeof Organization>;
  let UserOrganizationModel: jest.Mocked<typeof UserOrganization>;
  let ElectionModel: jest.Mocked<typeof Election>;
  let service: ReturnType<typeof createOrganizationService>;

  beforeEach(() => {
    OrganizationModel = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    } as any;

    UserOrganizationModel = {
      create: jest.fn(),
      destroy: jest.fn(),
    } as any;

    ElectionModel = {
      destroy: jest.fn(),
    } as any;

    service = createOrganizationService(
      OrganizationModel,
      UserOrganizationModel,
      ElectionModel,
    );

    jest.clearAllMocks();
  });

  describe("createOrganization", () => {
    it("creates an organization and assigns user to it", async () => {
      const mockOrg = {
        organization_id: "org-123",
        toJSON: jest
          .fn()
          .mockReturnValue({ organization_id: "org-123", name: "Test Org" }),
      };

      (OrganizationModel.create as jest.Mock).mockResolvedValue(mockOrg);
      (UserOrganizationModel.create as jest.Mock).mockResolvedValue({});

      const result = await service.createOrganization({
        userId: "user-1",
        name: "Test Org",
        description: "Test description",
        role: "user",
      });

      expect(OrganizationModel.create).toHaveBeenCalledWith(
        { name: "Test Org", description: "Test description" },
        { transaction: {} },
      );

      expect(UserOrganizationModel.create).toHaveBeenCalledWith(
        {
          user_id: "user-1",
          organization_id: "org-123",
          role: "user",
        },
        { transaction: {} },
      );

      expect(result).toEqual({ organization_id: "org-123", name: "Test Org" });
    });

    it("creates an organization and assigns election-manager role to it", async () => {
      const mockOrg = {
        organization_id: "org-123",
        toJSON: jest
          .fn()
          .mockReturnValue({ organization_id: "org-123", name: "Test Org" }),
      };

      (OrganizationModel.create as jest.Mock).mockResolvedValue(mockOrg);
      (UserOrganizationModel.create as jest.Mock).mockResolvedValue({});

      const result = await service.createOrganization({
        userId: "user-1",
        name: "Test Org",
        description: "Test description",
      });

      expect(OrganizationModel.create).toHaveBeenCalledWith(
        { name: "Test Org", description: "Test description" },
        { transaction: {} },
      );

      expect(UserOrganizationModel.create).toHaveBeenCalledWith(
        {
          user_id: "user-1",
          organization_id: "org-123",
          role: "election-manager",
        },
        { transaction: {} },
      );

      expect(result).toEqual({ organization_id: "org-123", name: "Test Org" });
    });
  });

  describe("getAllOrganizations", () => {
    it("returns all organizations", async () => {
      const orgs = [
        {
          toJSON: jest
            .fn()
            .mockReturnValue({ organization_id: "1", name: "Org1" }),
        },
        {
          toJSON: jest
            .fn()
            .mockReturnValue({ organization_id: "2", name: "Org2" }),
        },
      ];
      (OrganizationModel.findAll as jest.Mock).mockResolvedValue(orgs);

      const result = await service.getAllOrganizations();

      expect(OrganizationModel.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        { organization_id: "1", name: "Org1" },
        { organization_id: "2", name: "Org2" },
      ]);
    });
  });

  describe("getOrganizationById", () => {
    it("returns organization if found", async () => {
      const org = {
        toJSON: jest
          .fn()
          .mockReturnValue({ organization_id: "123", name: "Org1" }),
      };
      (OrganizationModel.findByPk as jest.Mock).mockResolvedValue(org);

      const result = await service.getOrganizationById("123");

      expect(OrganizationModel.findByPk).toHaveBeenCalledWith("123");
      expect(result).toEqual({ organization_id: "123", name: "Org1" });
    });

    it("returns null if not found", async () => {
      (OrganizationModel.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await service.getOrganizationById("not-found");

      expect(result).toBeNull();
    });
  });

  describe("updateOrganization", () => {
    it("updates and returns updated organization", async () => {
      const updatedOrg = {
        toJSON: jest
          .fn()
          .mockReturnValue({ organization_id: "123", name: "Updated Org" }),
      };
      (OrganizationModel.update as jest.Mock).mockResolvedValue([
        1,
        [updatedOrg],
      ]);

      const result = await service.updateOrganization("123", {
        name: "Updated Org",
      });

      expect(OrganizationModel.update).toHaveBeenCalledWith(
        { name: "Updated Org" },
        { where: { organization_id: "123" }, returning: true },
      );

      expect(result).toEqual({ organization_id: "123", name: "Updated Org" });
    });

    it("returns null if no organization updated", async () => {
      (OrganizationModel.update as jest.Mock).mockResolvedValue([0, []]);

      const result = await service.updateOrganization("999", {
        name: "Nothing",
      });

      expect(result).toBeNull();
    });
  });

  describe("deleteOrganization", () => {
    it("deletes elections, user orgs, and organization", async () => {
      (ElectionModel.destroy as jest.Mock).mockResolvedValue(1);
      (UserOrganizationModel.destroy as jest.Mock).mockResolvedValue(1);
      (OrganizationModel.destroy as jest.Mock).mockResolvedValue(1);

      const result = await service.deleteOrganization("org-123");

      expect(ElectionModel.destroy).toHaveBeenCalledWith({
        where: { organization_id: "org-123" },
        transaction: {},
      });

      expect(UserOrganizationModel.destroy).toHaveBeenCalledWith({
        where: { organization_id: "org-123" },
        transaction: {},
      });

      expect(OrganizationModel.destroy).toHaveBeenCalledWith({
        where: { organization_id: "org-123" },
        transaction: {},
      });

      expect(result).toBe(true);
    });

    it("returns false if organization not deleted", async () => {
      (ElectionModel.destroy as jest.Mock).mockResolvedValue(0);
      (UserOrganizationModel.destroy as jest.Mock).mockResolvedValue(0);
      (OrganizationModel.destroy as jest.Mock).mockResolvedValue(0);

      const result = await service.deleteOrganization("missing-org");

      expect(result).toBe(false);
    });
  });
});
