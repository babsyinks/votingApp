import { Request, Response, NextFunction } from "express";

import type { Organization } from "../models/organization";
import { organizationService } from "../services";
import type { CreateOrganizationParams } from "../services/organizationService";

/**
 * Create a new organization and assign user to given role.
 */
export const createOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, description, userId, role } =
      req.body as CreateOrganizationParams;

    const org = await organizationService.createOrganization({
      name,
      description,
      userId,
      role,
    });

    res.status(201).json(org);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves an organization by its ID.
 */
export const getOrganization = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const org: Organization | null =
      await organizationService.getOrganizationById(id);

    if (!org) {
      res.status(404).json({ error: "Organization not found" });
      return;
    }

    res.status(200).json(org);
  } catch (error) {
    next(error);
  }
};

/**
 * Updates organization details.
 */
export const updateOrganization = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body as Partial<Organization>;

    const org: Organization | null =
      await organizationService.updateOrganization(id, updates);

    if (!org) {
      res.status(404).json({ error: "Organization not found" });
      return;
    }

    res.status(200).json(org);
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes an organization (and cascades to its elections).
 */
export const deleteOrganization = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted: boolean = await organizationService.deleteOrganization(id);

    if (!deleted) {
      res.status(404).json({ error: "Organization not found" });
      return;
    }

    res.status(200).json({ message: "Organization deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export default {
  createOrganization,
  getOrganization,
  updateOrganization,
  deleteOrganization,
};
