"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
let stack = []; // create stack array before importing electionRoutes to put it in scope
// for the mock of "../../middleware/uploadMedia"
const electionRoutes_1 = __importDefault(require("../../routes/electionRoutes"));
jest.mock("../../middleware/uploadMedia", () => ({
    upload: {
        single: (pic) => {
            stack.push(pic);
            return (_req, _res, next) => next();
        },
    },
}));
jest.mock("../../controllers/electionController", () => ({
    addNewContestant: jest.fn((_req, res) => res.status(201).json({ success: true })),
    getElectionDetails: jest.fn((_req, res) => res.status(200).json({ details: true })),
    castVote: jest.fn((_req, res) => res.status(200).json({ vote: true })),
    deleteElection: jest.fn((_req, res) => res.status(204).send()),
}));
jest.mock("../../middleware/auth", () => ({
    checkAuthenticationStatus: (_req, _res, next) => next(),
    checkAuthorizationStatus: (_req, _res, next) => next(),
}));
const electionController = jest.requireMock("../../controllers/electionController");
let app;
beforeAll(() => {
    app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(electionRoutes_1.default);
});
beforeEach(() => {
    jest.clearAllMocks();
});
describe("electionRoutes", () => {
    describe("POST /contestants", () => {
        it("should register upload.single middleware with 'picture' and call addNewContestant", async () => {
            expect(stack).toEqual(["picture"]);
            const res = await (0, supertest_1.default)(app)
                .post("/contestants")
                .field("name", "John Doe");
            expect(electionController.addNewContestant).toHaveBeenCalledTimes(1);
            expect(res.status).toBe(201);
            expect(res.body).toEqual({ success: true });
        });
    });
    describe("GET /details", () => {
        it("should call getElectionDetails controller", async () => {
            const res = await (0, supertest_1.default)(app).get("/details");
            expect(electionController.getElectionDetails).toHaveBeenCalledTimes(1);
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ details: true });
        });
    });
    describe("POST /vote", () => {
        it("should call castVote controller", async () => {
            const res = await (0, supertest_1.default)(app).post("/vote").send({ contestantId: 1 });
            expect(electionController.castVote).toHaveBeenCalledTimes(1);
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ vote: true });
        });
    });
    describe("DELETE /delete", () => {
        it("should call deleteElection controller", async () => {
            const res = await (0, supertest_1.default)(app).delete("/delete");
            expect(electionController.deleteElection).toHaveBeenCalledTimes(1);
            expect(res.status).toBe(204);
            expect(res.text).toBe("");
        });
    });
});
