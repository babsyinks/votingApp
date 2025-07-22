const express = require("express");

const refreshTokenController = require("../controllers/refreshTokenController");

const router = express.Router();

router.post("/refresh", refreshTokenController.refreshToken);

module.exports = router;
