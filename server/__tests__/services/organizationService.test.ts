const { sequelize } = require("../../models");
const organizationServiceFactory = require("../../services/organizationService");

const Organization = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
};
const UserOrganization = { create: jest.fn(), destroy: jest.fn() };
const Election = { destroy: jest.fn() };

// Mock sequelize.transaction to execute callback immediately
sequelize.transaction = jest.fn((cb) => cb({}));

const organizationService = organizationServiceFactory(Organization, UserOrganization, Election);

describe("organizationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createOrganization", () => {
    it("creates an organization and assigns user to it", async () => {
      const mockOrg = {
        organization_id: "org-123",
        toJSON: () => ({ organization_id: "org-123", name: "Test Org" }),
      };
      Organization.create.mockResolvedValue(mockOrg);
      UserOrganization.create.mockResolvedValue({});

      const result = await organizationService.createOrganization({
        userId: "user-1",
        name: "Test Org",
        description: "Test description",
        role: "admin",
      });

      expect(Organization.create).toHaveBeenCalledWith(
        { name: "Test Org", description: "Test description" },
        { transaction: {} },
      );
      expect(UserOrganization.create).toHaveBeenCalledWith(
        { user_id: "user-1", organization_id: "org-123", role: "admin" },
        { transaction: {} },
      );
      expect(result).toEqual({ organization_id: "org-123", name: "Test Org" });
    });
  });

  describe("getAllOrganizations", () => {
    it("returns all organizations", async () => {
      const orgs = [
        { toJSON: () => ({ organization_id: "1", name: "Org1" }) },
        { toJSON: () => ({ organization_id: "2", name: "Org2" }) },
      ];
      Organization.findAll.mockResolvedValue(orgs);

      const result = await organizationService.getAllOrganizations();

      expect(Organization.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        { organization_id: "1", name: "Org1" },
        { organization_id: "2", name: "Org2" },
      ]);
    });
  });

  describe("getOrganizationById", () => {
    it("returns organization if found", async () => {
      const org = { toJSON: () => ({ organization_id: "123", name: "Org1" }) };
      Organization.findByPk.mockResolvedValue(org);

      const result = await organizationService.getOrganizationById("123");

      expect(Organization.findByPk).toHaveBeenCalledWith("123");
      expect(result).toEqual({ organization_id: "123", name: "Org1" });
    });

    it("returns null if not found", async () => {
      Organization.findByPk.mockResolvedValue(null);

      const result = await organizationService.getOrganizationById("not-found");

      expect(result).toBeNull();
    });
  });

  describe("updateOrganization", () => {
    it("updates and returns updated organization", async () => {
      const updatedOrg = { toJSON: () => ({ organization_id: "123", name: "Updated Org" }) };
      Organization.update.mockResolvedValue([1, [updatedOrg]]);

      const result = await organizationService.updateOrganization("123", { name: "Updated Org" });

      expect(Organization.update).toHaveBeenCalledWith(
        { name: "Updated Org" },
        { where: { organization_id: "123" }, returning: true },
      );
      expect(result).toEqual({ organization_id: "123", name: "Updated Org" });
    });

    it("returns null if no organization updated", async () => {
      Organization.update.mockResolvedValue([0, []]);

      const result = await organizationService.updateOrganization("999", { name: "Nothing" });

      expect(result).toBeNull();
    });
  });

  describe("deleteOrganization", () => {
    it("deletes elections, user orgs, and organization", async () => {
      Election.destroy.mockResolvedValue(1);
      UserOrganization.destroy.mockResolvedValue(1);
      Organization.destroy.mockResolvedValue(1);

      const result = await organizationService.deleteOrganization("org-123");

      expect(Election.destroy).toHaveBeenCalledWith({
        where: { organization_id: "org-123" },
        transaction: {},
      });
      expect(UserOrganization.destroy).toHaveBeenCalledWith({
        where: { organization_id: "org-123" },
        transaction: {},
      });
      expect(Organization.destroy).toHaveBeenCalledWith({
        where: { organization_id: "org-123" },
        transaction: {},
      });
      expect(result).toBe(true);
    });

    it("returns false if organization not deleted", async () => {
      Election.destroy.mockResolvedValue(0);
      UserOrganization.destroy.mockResolvedValue(0);
      Organization.destroy.mockResolvedValue(0);

      const result = await organizationService.deleteOrganization("missing-org");

      expect(result).toBe(false);
    });
  });
});
