import type { Transaction } from "sequelize";

import { sequelize } from "../models";
import type { Election } from "../models/election";
import type { Organization } from "../models/organization";
import type { UserOrganization } from "../models/userOrganization";

export interface CreateOrganizationParams {
  userId: string;
  name: string;
  description?: string;
  role?: "user" | "election-manager";
}

export interface OrganizationService {
  createOrganization(params: CreateOrganizationParams): Promise<Organization>;
  getAllOrganizations(): Promise<Organization[]>;
  getOrganizationById(organizationId: string): Promise<Organization | null>;
  updateOrganization(
    organizationId: string,
    updates: Partial<Pick<Organization, "name" | "description">>,
  ): Promise<Organization | null>;
  deleteOrganization(organizationId: string): Promise<boolean>;
}

/**
 * Organization service factory.
 *
 * Injects dependencies for Organization, UserOrganization, and Election models.
 */
export const createOrganizationService = (
  OrganizationModel: typeof Organization,
  UserOrganizationModel: typeof UserOrganization,
  ElectionModel: typeof Election,
): OrganizationService => {
  return {
    /**
     * Create a new organization and assign a user to it with a role.
     */
    async createOrganization({
      userId,
      name,
      description,
      role = "election-manager",
    }: CreateOrganizationParams): Promise<Organization> {
      return sequelize.transaction(async (t: Transaction) => {
        const organization = await OrganizationModel.create(
          { name, description },
          { transaction: t },
        );

        await UserOrganizationModel.create(
          {
            user_id: userId,
            organization_id: organization.organization_id,
            role,
          },
          { transaction: t },
        );

        return organization.toJSON() as Organization;
      });
    },

    /**
     * Get all organizations.
     */
    async getAllOrganizations(): Promise<Organization[]> {
      const organizations = await OrganizationModel.findAll();
      return organizations.map((org) => org.toJSON() as Organization);
    },

    /**
     * Get organization by ID.
     */
    async getOrganizationById(
      organizationId: string,
    ): Promise<Organization | null> {
      const organization = await OrganizationModel.findByPk(organizationId);
      return organization ? (organization.toJSON() as Organization) : null;
    },

    /**
     * Update organization details.
     */
    async updateOrganization(
      organizationId: string,
      updates: Partial<Pick<Organization, "name" | "description">>,
    ): Promise<Organization | null> {
      const [count, rows] = await OrganizationModel.update(updates, {
        where: { organization_id: organizationId },
        returning: true,
      });

      if (count === 0) return null;
      return rows[0].toJSON() as Organization;
    },

    /**
     * Delete organization and cascade delete elections and user organizations.
     */
    async deleteOrganization(organizationId: string): Promise<boolean> {
      return sequelize.transaction(async (t: Transaction) => {
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

export default createOrganizationService;
