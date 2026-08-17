"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const electionController = __importStar(require("../../controllers/electionController"));
const services_1 = require("../../services");
jest.mock("../../services", () => ({
    electionService: {
        createContestant: jest.fn(),
        getElectionSummary: jest.fn(),
        castVote: jest.fn(),
        clearElectionData: jest.fn(),
    },
}));
describe("electionController", () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = { body: {}, file: {}, user: {} };
        res = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });
    describe("addNewContestant", () => {
        it("should return 400 if no file is uploaded", async () => {
            req.file = null;
            await electionController.addNewContestant(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "No file uploaded" });
        });
        it("should create contestant and return 201", async () => {
            req.file = { path: "path/to/file.jpg" };
            req.body = {
                surname: "Doe",
                firstName: "John",
                post: "President",
                manifesto: "My vision...",
            };
            const newContestant = { id: '1', surname: "Doe" };
            services_1.electionService.createContestant.mockResolvedValue(newContestant);
            await electionController.addNewContestant(req, res, next);
            expect(services_1.electionService.createContestant).toHaveBeenCalledWith({
                surname: "Doe",
                firstname: "John",
                position: "President",
                manifesto: "My vision...",
                picture: "path/to/file.jpg",
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: "success",
                contestant: newContestant,
            });
        });
        it("should call next on error", async () => {
            req.file = { path: "pic.jpg" };
            services_1.electionService.createContestant.mockRejectedValue(new Error("DB fail"));
            await electionController.addNewContestant(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
    describe("getElectionDetails", () => {
        it("should return election summary with user info", async () => {
            req.user = { user_id: '5', username: "john", role: "voter" };
            services_1.electionService.getElectionSummary.mockResolvedValue({
                totalVotes: 100,
            });
            await electionController.getElectionDetails(req, res, next);
            expect(services_1.electionService.getElectionSummary).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({
                electionData: { totalVotes: 100 },
                userId: '5',
                username: "john",
                role: "voter",
            });
        });
        it("should call next on error", async () => {
            services_1.electionService.getElectionSummary.mockRejectedValue(new Error("DB fail"));
            await electionController.getElectionDetails(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
    describe("castVote", () => {
        it("should return 400 if request is malformed", async () => {
            req.body = { userId: '1', contestantId: null, position: "President" };
            await electionController.castVote(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "malformed request" });
        });
        it("should cast vote and return updated vote counts", async () => {
            req.body = { userId: '1', contestantId: '2', electionId: '3', position: "President" };
            services_1.electionService.castVote.mockResolvedValue({
                positionVotes: 10,
                contestantVotes: 4,
            });
            await electionController.castVote(req, res, next);
            expect(services_1.electionService.castVote).toHaveBeenCalledWith('1', '2', "President", '3');
            expect(res.json).toHaveBeenCalledWith({
                positionVotes: 10,
                contestantVotes: 4,
            });
        });
        it("should call next on error", async () => {
            req.body = { userId: '1', contestantId: '2', electionId: '3', position: "President" };
            services_1.electionService.castVote.mockRejectedValue(new Error("Vote fail"));
            await electionController.castVote(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
    describe("deleteElection", () => {
        it("should clear election data and return success", async () => {
            await electionController.deleteElection(req, res, next);
            expect(services_1.electionService.clearElectionData).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ message: "success" });
        });
        it("should call next on error", async () => {
            services_1.electionService.clearElectionData.mockRejectedValue(new Error("Delete fail"));
            await electionController.deleteElection(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});
