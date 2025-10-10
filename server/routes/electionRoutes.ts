import express, { Router } from "express";

import * as electionController from "../controllers/electionController";
import {
  checkAuthenticationStatus,
  checkAuthorizationStatus,
} from "../middleware/auth";
import { upload } from "../middleware/uploadMedia";

const router: Router = express.Router();
router.use(express.json());

router.post(
  "/contestants",
  upload.single("picture"),
  electionController.addNewContestant,
);

router.get(
  "/details",
  checkAuthenticationStatus,
  electionController.getElectionDetails,
);

router.post("/vote", checkAuthenticationStatus, electionController.castVote);

router.delete(
  "/delete",
  checkAuthorizationStatus,
  electionController.deleteElection,
);

export default router;
