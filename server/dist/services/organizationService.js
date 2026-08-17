"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrganizationService = void 0;
const models_1 = require("../models");
/**
 * Organization service factory.
 *
 * Injects dependencies for Organization, UserOrganization, and Election models.
 */
const createOrganizationService = (OrganizationModel, UserOrganizationModel, ElectionModel) => {
    return {
        /**
         * Create a new organization and assign a user to it with a role.
         */
        async createOrganization({ userId, name, description, role = "election-manager", }) {
            return models_1.sequelize.transaction(async (t) => {
                const organization = await OrganizationModel.create({ name, description }, { transaction: t });
                await UserOrganizationModel.create({
                    user_id: userId,
                    organization_id: organization.organization_id,
                    role,
                }, { transaction: t });
                return organization.toJSON();
            });
        },
        /**
         * Get all organizations.
         */
        async getAllOrganizations() {
            const organizations = await OrganizationModel.findAll();
            return organizations.map((org) => org.toJSON());
        },
        /**
         * Get organization by ID.
         */
        async getOrganizationById(organizationId) {
            const organization = await OrganizationModel.findByPk(organizationId);
            return organization ? organization.toJSON() : null;
        },
        /**
         * Update organization details.
         */
        async updateOrganization(organizationId, updates) {
            const [count, rows] = await OrganizationModel.update(updates, {
                where: { organization_id: organizationId },
                returning: true,
            });
            if (count === 0)
                return null;
            return rows[0].toJSON();
        },
        /**
         * Delete organization and cascade delete elections and user organizations.
         */
        async deleteOrganization(organizationId) {
            return models_1.sequelize.transaction(async (t) => {
                await ElectionModel.destroy({
                    where: { organization_id: organizationId },
                    transaction: t,
                });
                await UserOrganizationModel.destroy({
                    where: { organization_id: organizationId },
                    transaction: t,
                });
                const deletedCount = await OrganizationModel.destroy({
                    where: { organization_id: organizationId },
                    transaction: t,
                });
                return deletedCount > 0;
            });
        },
    };
};
exports.createOrganizationService = createOrganizationService;
exports.default = exports.createOrganizationService;
