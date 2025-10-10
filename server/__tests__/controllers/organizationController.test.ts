import {
  createOrganization,
  getOrganization,
  updateOrganization,
  deleteOrganization,
} from "../../controllers/organizationController";
import { organizationService } from "../../services";

jest.mock("../../services", () => ({
  organizationService: {
    createOrganization: jest.fn(),
    getOrganizationById: jest.fn(),
    updateOrganization: jest.fn(),
    deleteOrganization: jest.fn(),
  },
}));

describe("organizationController", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

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
      req.body = {
        name: "Test Org",
        description: "Desc",
        userId: "user-1",
        role: "admin",
      };
      (organizationService.createOrganization as jest.Mock).mockResolvedValue(
        org,
      );

      await createOrganization(req, res, next);

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
      (organizationService.createOrganization as jest.Mock).mockRejectedValue(
        error,
      );

      await createOrganization(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getOrganization", () => {
    it("returns 200 and organization if found", async () => {
      const org = { organization_id: "1", name: "Org1" };
      req.params.id = "1";
      (organizationService.getOrganizationById as jest.Mock).mockResolvedValue(
        org,
      );

      await getOrganization(req, res, next);

      expect(organizationService.getOrganizationById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(org);
    });

    it("returns 404 if not found", async () => {
      req.params.id = "1";
      (organizationService.getOrganizationById as jest.Mock).mockResolvedValue(
        null,
      );

      await getOrganization(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Organization not found",
      });
    });

    it("calls next on error", async () => {
      const error = new Error("Unexpected");
      (organizationService.getOrganizationById as jest.Mock).mockRejectedValue(
        error,
      );

      await getOrganization(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("updateOrganization", () => {
    it("returns 200 with updated org", async () => {
      const updated = { organization_id: "1", name: "Updated Org" };
      req.params.id = "1";
      req.body = { name: "Updated Org" };
      (organizationService.updateOrganization as jest.Mock).mockResolvedValue(
        updated,
      );

      await updateOrganization(req, res, next);

      expect(organizationService.updateOrganization).toHaveBeenCalledWith("1", {
        name: "Updated Org",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it("returns 404 if not found", async () => {
      req.params.id = "99";
      req.body = { name: "Nothing" };
      (organizationService.updateOrganization as jest.Mock).mockResolvedValue(
        null,
      );

      await updateOrganization(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Organization not found",
      });
    });

    it("calls next on error", async () => {
      const error = new Error("DB issue");
      (organizationService.updateOrganization as jest.Mock).mockRejectedValue(
        error,
      );

      await updateOrganization(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteOrganization", () => {
    it("returns 200 if deleted", async () => {
      req.params.id = "1";
      (organizationService.deleteOrganization as jest.Mock).mockResolvedValue(
        true,
      );

      await deleteOrganization(req, res, next);

      expect(organizationService.deleteOrganization).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Organization deleted successfully",
      });
    });

    it("returns 404 if not deleted", async () => {
      req.params.id = "1";
      (organizationService.deleteOrganization as jest.Mock).mockResolvedValue(
        false,
      );

      await deleteOrganization(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Organization not found",
      });
    });

    it("calls next on error", async () => {
      const error = new Error("DB error");
      (organizationService.deleteOrganization as jest.Mock).mockRejectedValue(
        error,
      );

      await deleteOrganization(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
