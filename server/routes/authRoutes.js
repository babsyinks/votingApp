const express = require("express");

const authController = require("../controllers/authController");

const router = express.Router();
router.use(express.json());

router.post("/request-signup-code", authController.requestSignUpCode);

router.post("/verify-signup-code", authController.verifySignUpCode);

router.post("/register", authController.register);

router.post("/signin", authController.signin);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password", authController.resetPassword);

router.post("/signout", authController.signout);

module.exports = router;
