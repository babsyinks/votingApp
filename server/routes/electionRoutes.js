const express = require("express");

const electionController = require("../controllers/electionController");
const { checkAuthenticationStatus, checkAuthorizationStatus } = require("../middleware/auth");
const { upload } = require("../middleware/uploadMedia");

const router = express.Router();
router.use(express.json());

router.post("/contestants", upload.single("picture"), electionController.addNewContestant);

router.get("/details", checkAuthenticationStatus, electionController.getElectionDetails);

router.post("/vote", checkAuthenticationStatus, electionController.castVote);

router.delete("/delete", checkAuthorizationStatus, electionController.deleteElection);

module.exports = router;
