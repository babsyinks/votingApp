import express, { Router } from "express";

import * as oAuthController from "../controllers/oAuthController";
import { checkAuthenticationStatus } from "../middleware/auth";

const router: Router = express.Router();
router.use(express.json());

router.get("/google", oAuthController.googleOauthStart);

router.get("/google/callback", oAuthController.googleOauthConclude);

router.get("/facebook", oAuthController.facebookOauthStart);

router.get("/facebook/callback", oAuthController.facebookOauthConclude);

router.get("/github", oAuthController.githubOauthStart);

router.get("/github/callback", oAuthController.githubOauthConclude);

router.get(
  "/me",
  checkAuthenticationStatus,
  oAuthController.getUserDetailsOnOauthSuccess,
);

export default router;
