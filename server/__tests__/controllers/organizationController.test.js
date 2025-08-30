const controller = require("../../controllers/organizationController");
const { organizationService } = require("../../services");

jest.mock("../../services", () => ({
  organizationService: {
    createOrganization: jest.fn(),
    getOrganizationById: jest.fn(),
    updateOrganization: jest.fn(),
    deleteOrganization: jest.fn(),
  },
}));

describe("organizationController", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("createOrganization", () => {
    it("creates organization and returns 201", async () => {
      const org = { organization_id: "1", name: "Test Org" };
      req.body = { name: "Test Org", description: "Desc", userId: "user-1", role: "admin" };
      organizationService.createOrganization.mockResolvedValue(org);

      await controller.createOrganization(req, res, next);

      expect(organizationService.createOrganization).toHaveBeenCalledWith({
        name: "Test Org",
        description: "Desc",
        userId: "user-1",
        role: "admin",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(org);
    });

    it("calls next on error", async () => {
      const error = new Error("DB error");
      organizationService.createOrganization.mockRejectedValue(error);

      await controller.createOrganization(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getOrganization", () => {
    it("returns 200 and organization if found", async () => {
      const org = { organization_id: "1", name: "Org1" };
      req.params.id = "1";
      organizationService.getOrganizationById.mockResolvedValue(org);

      await controller.getOrganization(req, res, next);

      expect(organizationService.getOrganizationById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(org);
    });

    it("returns 404 if not found", async () => {
      req.params.id = "1";
      organizationService.getOrganizationById.mockResolvedValue(null);

      await controller.getOrganization(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Organization not found" });
    });

    it("calls next on error", async () => {
      const error = new Error("Unexpected");
      organizationService.getOrganizationById.mockRejectedValue(error);

      await controller.getOrganization(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("updateOrganization", () => {
    it("returns 200 with updated org", async () => {
      const updated = { organization_id: "1", name: "Updated Org" };
      req.params.id = "1";
      req.body = { name: "Updated Org" };
      organizationService.updateOrganization.mockResolvedValue(updated);

      await controller.updateOrganization(req, res, next);

      expect(organizationService.updateOrganization).toHaveBeenCalledWith("1", { name: "Updated Org" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it("returns 404 if not found", async () => {
      req.params.id = "99";
      req.body = { name: "Nothing" };
      organizationService.updateOrganization.mockResolvedValue(null);

      await controller.updateOrganization(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Organization not found" });
    });

    it("calls next on error", async () => {
      const error = new Error("DB issue");
      organizationService.updateOrganization.mockRejectedValue(error);

      await controller.updateOrganization(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteOrganization", () => {
    it("returns 200 if deleted", async () => {
      req.params.id = "1";
      organizationService.deleteOrganization.mockResolvedValue(true);

      await controller.deleteOrganization(req, res, next);

      expect(organizationService.deleteOrganization).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Organization deleted successfully" });
    });

    it("returns 404 if not deleted", async () => {
      req.params.id = "1";
      organizationService.deleteOrganization.mockResolvedValue(false);

      await controller.deleteOrganization(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Organization not found" });
    });

    it("calls next on error", async () => {
      const error = new Error("DB error");
      organizationService.deleteOrganization.mockRejectedValue(error);

      await controller.deleteOrganization(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
