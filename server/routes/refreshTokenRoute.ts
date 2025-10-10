import express, { Router } from "express";

import { refreshToken } from "../controllers/refreshTokenController";

const router: Router = express.Router();

router.post("/refresh", refreshToken);

export default router;
