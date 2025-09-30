const { sequelize } = require("../models");

module.exports = (Organization, UserOrganization, Election) => {
  return {
    /**
     * Create a new organization and assign a user to it with a role.
     *
     * @param {string} userId - ID of the user creating the organization
     * @param {string} name - Name of the organization
     * @param {string} description - Description of the organization
     * @param {string} role - Role of the user in the organization
     * @returns {Promise<Object>} The created organization
     */
    async createOrganization({ userId, name, description, role = "election-manager" }) {
      return await sequelize.transaction(async (t) => {
        const organization = await Organization.create({ name, description }, { transaction: t });

        await UserOrganization.create(
          {
            user_id: userId,
            organization_id: organization.organization_id,
            role,
          },
          { transaction: t },
        );

        return organization.toJSON();
      });
    },

    /**
     * Get all organizations.
     *
     * @returns {Promise<Organization[]>} List of organizations
     */
    async getAllOrganizations() {
      const organizations = await Organization.findAll();
      return organizations.map((org) => org.toJSON());
    },

    /**
     * Get organization by ID.
     *
     * @param {string} organizationId - The ID of the organization
     * @returns {Promise<Organization|null>} The organization or null
     */
    async getOrganizationById(organizationId) {
      const organization = await Organization.findByPk(organizationId);
      return organization?.toJSON() || null;
    },

    /**
     * Update organization details.
     *
     * @param {string} organizationId - The ID of the organization
     * @param {Object} updates - Fields to update
     * @returns {Promise<Organization|null>} Updated organization or null if not found
     */
    async updateOrganization(organizationId, updates) {
      const [count, rows] = await Organization.update(updates, {
        where: { organization_id: organizationId },
        returning: true,
      });

      if (count === 0) return null;
      return rows[0].toJSON();
    },

    /**
     * Delete organization and cascade delete elections and user organizations.
     *
     * @param {string} organizationId - The ID of the organization
     * @returns {Promise<boolean>} True if deleted, false otherwise
     */
    async deleteOrganization(organizationId) {
      return await sequelize.transaction(async (t) => {
        await Election.destroy({
          where: { organization_id: organizationId },
          transaction: t,
        });

        await UserOrganization.destroy({
          where: { organization_id: organizationId },
          transaction: t,
        });

        const deletedCount = await Organization.destroy({
          where: { organization_id: organizationId },
          transaction: t,
        });

        return deletedCount > 0;
      });
    },
  };
};
