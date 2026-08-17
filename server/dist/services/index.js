"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.organizationService = exports.electionService = exports.userService = exports.codeService = exports.timerService = exports.contestantsService = exports.votesService = void 0;
/* eslint-disable import/order */
const models_1 = require("../models");
const votesService_1 = __importDefault(require("../services/votesService"));
const contestantsService_1 = __importDefault(require("./contestantsService"));
const timerService_1 = __importDefault(require("./timerService"));
const codeService_1 = __importDefault(require("./codeService"));
const userService_1 = __importDefault(require("./userService"));
const electionService_1 = __importDefault(require("./electionService"));
const organizationService_1 = __importDefault(require("./organizationService"));
exports.votesService = (0, votesService_1.default)(models_1.Votes);
exports.contestantsService = (0, contestantsService_1.default)(models_1.Contestants);
exports.timerService = (0, timerService_1.default)(models_1.Timer);
exports.codeService = (0, codeService_1.default)(models_1.Code);
exports.userService = (0, userService_1.default)(models_1.User);
exports.electionService = (0, electionService_1.default)({
    votesService: exports.votesService,
    contestantsService: exports.contestantsService,
    timerService: exports.timerService,
});
exports.organizationService = (0, organizationService_1.default)(models_1.Organization, models_1.UserOrganization, models_1.Election);
exports.authService = {
    ...exports.userService,
    ...exports.codeService,
};
exports.default = {
    votesService: exports.votesService,
    contestantsService: exports.contestantsService,
    timerService: exports.timerService,
    codeService: exports.codeService,
    userService: exports.userService,
    electionService: exports.electionService,
    organizationService: exports.organizationService,
    authService: exports.authService,
};
