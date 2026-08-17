"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContestantsService = void 0;
const createContestantsService = (ContestantsModel) => {
    return {
        /**
         * Add a new contestant.
         *
         * @param contestantData - Data used to create the new contestant
         * @returns The newly created contestant record
         */
        async createContestant(contestantData) {
            return ContestantsModel.create(contestantData);
        },
        /**
         * Find contestant by ID.
         *
         * @param contestant_id - ID of the contestant to find
         * @returns The contestant record as a plain object, or undefined if not found
         */
        async findContestantById(contestant_id) {
            const contestant = await ContestantsModel.findOne({
                where: { contestant_id },
            });
            return contestant?.toJSON();
        },
        /**
         * Fetch all contestants.
         *
         * @returns A list of all contestants as plain objects
         */
        async getAllContestants() {
            const contestants = await ContestantsModel.findAll();
            return contestants.map((contestant) => contestant.toJSON());
        },
    };
};
exports.createContestantsService = createContestantsService;
exports.default = exports.createContestantsService;
