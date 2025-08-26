const { organizationService } = require("../services");

module.exports = {
  /**
   * Create a new organization and assign user to given role.
   */
  async createOrganization(req, res, next) {
    try {
      const { name, description, userId, role } = req.body;

      const org = await organizationService.createOrganization({ name, description, userId, role });

      return res.status(201).json(org);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get an organization by ID
   */
  async getOrganization(req, res, next) {
    try {
      const { id } = req.params;
      const org = await organizationService.getOrganizationById(id);

      if (!org) {
        return res.status(404).json({ error: "Organization not found" });
      }

      return res.status(200).json(org);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update organization details
   */
  async updateOrganization(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const org = await organizationService.updateOrganization(id, updates);

      if (!org) {
        return res.status(404).json({ error: "Organization not found" });
      }

      return res.status(200).json(org);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete organization (and cascade delete elections)
   */
  async deleteOrganization(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await organizationService.deleteOrganization(id);

      if (!deleted) {
        return res.status(404).json({ error: "Organization not found" });
      }

      return res.status(200).json({ message: "Organization deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};
