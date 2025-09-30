const express = require("express");

const oAuthController = require("../controllers/oAuthController");
const { checkAuthenticationStatus } = require("../middleware/auth");

const router = express.Router();
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

module.exports = router;
