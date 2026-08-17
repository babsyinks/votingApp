"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrganization = exports.updateOrganization = exports.getOrganization = exports.createOrganization = void 0;
const services_1 = require("../services");
/**
 * Create a new organization and assign user to given role.
 */
const createOrganization = async (req, res, next) => {
    try {
        const { name, description, userId, role } = req.body;
        const org = await services_1.organizationService.createOrganization({
            name,
            description,
            userId,
            role,
        });
        res.status(201).json(org);
    }
    catch (error) {
        next(error);
    }
};
exports.createOrganization = createOrganization;
/**
 * Retrieves an organization by its ID.
 */
const getOrganization = async (req, res, next) => {
    try {
        const { id } = req.params;
        const org = await services_1.organizationService.getOrganizationById(id);
        if (!org) {
            res.status(404).json({ error: "Organization not found" });
            return;
        }
        res.status(200).json(org);
    }
    catch (error) {
        next(error);
    }
};
exports.getOrganization = getOrganization;
/**
 * Updates organization details.
 */
const updateOrganization = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const org = await services_1.organizationService.updateOrganization(id, updates);
        if (!org) {
            res.status(404).json({ error: "Organization not found" });
            return;
        }
        res.status(200).json(org);
    }
    catch (error) {
        next(error);
    }
};
exports.updateOrganization = updateOrganization;
/**
 * Deletes an organization (and cascades to its elections).
 */
const deleteOrganization = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await services_1.organizationService.deleteOrganization(id);
        if (!deleted) {
            res.status(404).json({ error: "Organization not found" });
            return;
        }
        res.status(200).json({ message: "Organization deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteOrganization = deleteOrganization;
exports.default = {
    createOrganization: exports.createOrganization,
    getOrganization: exports.getOrganization,
    updateOrganization: exports.updateOrganization,
    deleteOrganization: exports.deleteOrganization,
};
