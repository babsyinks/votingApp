import express, { Router } from "express";

import authRoutes from "./authRoutes";
import electionRoutes from "./electionRoutes";
import oAuthRoutes from "./oauthRoutes";
import refreshTokenRoute from "./refreshTokenRoute";
import timerRoutes from "./timerRoutes";

const router: Router = express.Router();

router.use("/auth", authRoutes);
router.use("/oauth", oAuthRoutes);
router.use("/election", electionRoutes);
router.use("/timer", timerRoutes);
router.use("/token", refreshTokenRoute);

export default router;
