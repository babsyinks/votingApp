"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createElectionService = void 0;
const electionHelpers_1 = require("../helpers/electionHelpers");
const generateCustomError_1 = __importDefault(require("../utils/generateCustomError"));
const createElectionService = ({ votesService, contestantsService, timerService, }) => {
    return {
        /**
         * Create a new contestant.
         *
         * @param contestantData Details of the contestant to create
         * @returns Promise<ContestantsAttributes>
         */
        async createContestant(contestantData) {
            return contestantsService.createContestant(contestantData);
        },
        /**
         * Find a contestant by ID.
         *
         * @param contestant_id The id of the contestant
         * @returns Promise<ContestantsAttributes | null>
         */
        async findContestant(contestant_id) {
            return contestantsService.findContestantById(contestant_id);
        },
        /**
         * Returns a full summary of all contestants grouped by position with votes.
         *
         * @returns Promise<Record<ElectionDetails[] | ContestantsAttributes[]>
         */
        async getElectionSummary() {
            const contestants = await contestantsService.getAllContestants();
            const votes = await votesService.getAllVotes();
            if (contestants.length === 0) {
                return contestants;
            }
            return (0, electionHelpers_1.getAllContestantsElectionDetails)({ contestants, votes });
        },
        /**
         * Casts a vote for a contestant if the user hasn't already voted.
         *
         * @param userId Id of the user
         * @param contestantId Id of the contestant
         * @param position Position being contested
         * @param electionId Id of the ongoing election
         * @returns Object containing position and contestant vote counts
         */
        async castVote(userId, contestantId, position, electionId) {
            let votes = await votesService.getAllVotes();
            if ((0, electionHelpers_1.userHasVoted)(votes, userId)) {
                (0, generateCustomError_1.default)("User has already voted", 403);
            }
            await votesService.castVote({
                userId,
                contestantId,
                position,
                electionId,
            });
            votes = await votesService.getAllVotes();
            return {
                positionVotes: (0, electionHelpers_1.getAllVotesForAPosition)({ votes, position }),
                contestantVotes: (0, electionHelpers_1.getVotesForAContestant)({ votes, contestantId }),
            };
        },
        /**
         * Clears all votes and resets the timer.
         *
         * @returns Promise<void>
         */
        async clearElectionData() {
            await votesService.clearVotes();
            await timerService.clearTimer();
        },
    };
};
exports.createElectionService = createElectionService;
exports.default = exports.createElectionService;
