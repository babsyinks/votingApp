const express = require("express");

const authRoutes = require("./authRoutes");
const electionRoutes = require("./electionRoutes");
const oAuthRoutes = require("./oauthRoutes");
const refreshRoute = require("./refreshTokenRoute");
const timerRoutes = require("./timerRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/oauth", oAuthRoutes);
router.use("/election", electionRoutes);
router.use("/timer", timerRoutes);
router.use("/token", refreshRoute);

module.exports = router;
