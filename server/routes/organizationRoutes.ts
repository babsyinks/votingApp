import express, { Router } from "express";

import * as organizationController from "../controllers/organizationController";
import {
  checkAuthenticationStatus,
  checkAuthorizationStatus,
} from "../middleware/auth";

const router: Router = express.Router();
router.use(express.json());

router.post("/organization", organizationController.createOrganization);

router.get(
  "/organization/:id",
  checkAuthenticationStatus,
  organizationController.getOrganization,
);

router.patch(
  "/organization/:id",
  checkAuthenticationStatus,
  organizationController.updateOrganization,
);

router.delete(
  "/organization/:id",
  checkAuthorizationStatus,
  organizationController.deleteOrganization,
);

export default router;
