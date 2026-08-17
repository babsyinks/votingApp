"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const electionRoutes_1 = __importDefault(require("./electionRoutes"));
const oauthRoutes_1 = __importDefault(require("./oauthRoutes"));
const refreshTokenRoute_1 = __importDefault(require("./refreshTokenRoute"));
const timerRoutes_1 = __importDefault(require("./timerRoutes"));
const router = express_1.default.Router();
router.use("/auth", authRoutes_1.default);
router.use("/oauth", oauthRoutes_1.default);
router.use("/election", electionRoutes_1.default);
router.use("/timer", timerRoutes_1.default);
router.use("/token", refreshTokenRoute_1.default);
exports.default = router;
