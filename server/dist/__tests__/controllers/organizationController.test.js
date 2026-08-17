"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const organizationController_1 = require("../../controllers/organizationController");
const services_1 = require("../../services");
jest.mock("../../services", () => ({
    organizationService: {
        createOrganization: jest.fn(),
        getOrganizationById: jest.fn(),
        updateOrganization: jest.fn(),
        deleteOrganization: jest.fn(),
    },
}));
describe("organizationController", () => {
    let req;
    let res;
    let next;
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
            services_1.organizationService.createOrganization.mockResolvedValue(org);
            await (0, organizationController_1.createOrganization)(req, res, next);
            expect(services_1.organizationService.createOrganization).toHaveBeenCalledWith({
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
            services_1.organizationService.createOrganization.mockRejectedValue(error);
            await (0, organizationController_1.createOrganization)(req, res, next);
            expect(next).toHaveBeenCalledWith(error);
        });
    });
    describe("getOrganization", () => {
        it("returns 200 and organization if found", async () => {
            const org = { organization_id: "1", name: "Org1" };
            req.params.id = "1";
            services_1.organizationService.getOrganizationById.mockResolvedValue(org);
            await (0, organizationController_1.getOrganization)(req, res, next);
            expect(services_1.organizationService.getOrganizationById).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(org);
        });
        it("returns 404 if not found", async () => {
            req.params.id = "1";
            services_1.organizationService.getOrganizationById.mockResolvedValue(null);
            await (0, organizationController_1.getOrganization)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: "Organization not found",
            });
        });
        it("calls next on error", async () => {
            const error = new Error("Unexpected");
            services_1.organizationService.getOrganizationById.mockRejectedValue(error);
            await (0, organizationController_1.getOrganization)(req, res, next);
            expect(next).toHaveBeenCalledWith(error);
        });
    });
    describe("updateOrganization", () => {
        it("returns 200 with updated org", async () => {
            const updated = { organization_id: "1", name: "Updated Org" };
            req.params.id = "1";
            req.body = { name: "Updated Org" };
            services_1.organizationService.updateOrganization.mockResolvedValue(updated);
            await (0, organizationController_1.updateOrganization)(req, res, next);
            expect(services_1.organizationService.updateOrganization).toHaveBeenCalledWith("1", {
                name: "Updated Org",
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updated);
        });
        it("returns 404 if not found", async () => {
            req.params.id = "99";
            req.body = { name: "Nothing" };
            services_1.organizationService.updateOrganization.mockResolvedValue(null);
            await (0, organizationController_1.updateOrganization)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: "Organization not found",
            });
        });
        it("calls next on error", async () => {
            const error = new Error("DB issue");
            services_1.organizationService.updateOrganization.mockRejectedValue(error);
            await (0, organizationController_1.updateOrganization)(req, res, next);
            expect(next).toHaveBeenCalledWith(error);
        });
    });
    describe("deleteOrganization", () => {
        it("returns 200 if deleted", async () => {
            req.params.id = "1";
            services_1.organizationService.deleteOrganization.mockResolvedValue(true);
            await (0, organizationController_1.deleteOrganization)(req, res, next);
            expect(services_1.organizationService.deleteOrganization).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Organization deleted successfully",
            });
        });
        it("returns 404 if not deleted", async () => {
            req.params.id = "1";
            services_1.organizationService.deleteOrganization.mockResolvedValue(false);
            await (0, organizationController_1.deleteOrganization)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: "Organization not found",
            });
        });
        it("calls next on error", async () => {
            const error = new Error("DB error");
            services_1.organizationService.deleteOrganization.mockRejectedValue(error);
            await (0, organizationController_1.deleteOrganization)(req, res, next);
            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
