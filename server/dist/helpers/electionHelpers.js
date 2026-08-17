"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userHasVoted = exports.getAllContestantsElectionDetails = exports.getVotesForAContestant = exports.getAllVotesForAPosition = void 0;
const electionPositionRank_1 = __importDefault(require("../config/electionPositionRank"));
/**
 * creates array of same length as all keys of positionRank object, then fills it with null.
 */
const _initializeArrayOfContestants = () => {
    return new Array(Object.keys(electionPositionRank_1.default).length).fill(null);
};
/**
 * Gets the current rank of a position. The ranks are arranged in ascending order between 0 and 10.
 */
const _getCurrentPositionRank = (contestant) => {
    return electionPositionRank_1.default[contestant.position.toLowerCase()];
};
/**
 * Filters the voting data based on a property (e.g., position, contestant_id).
 */
const _filterVotesByProperty = ({ votes, property, value, }) => {
    if (value === undefined)
        throw new Error(`value set to filter ${property} shouldn't be undefined`);
    return votes.filter((voteDetails) => voteDetails[property] === value);
};
/**
 * Returns an array of voter ids from vote objects.
 */
const _getAllVotersId = (voters) => {
    return voters.map((voteDetails) => voteDetails.user_id);
};
/**
 * Returns all votes for a position.
 */
const getAllVotesForAPosition = ({ votes, contestant, position, }) => {
    return _getAllVotersId(_filterVotesByProperty({
        votes,
        property: "position",
        value: position || contestant?.position,
    }));
};
exports.getAllVotesForAPosition = getAllVotesForAPosition;
/**
 * Returns all votes for a given contestant.
 */
const getVotesForAContestant = ({ votes, contestant, contestantId, }) => {
    return _getAllVotersId(_filterVotesByProperty({
        votes,
        property: "contestant_id",
        value: contestantId || contestant?.contestant_id,
    }));
};
exports.getVotesForAContestant = getVotesForAContestant;
/**
 * Builds the contestant object with votes.
 */
const _buildContestantsObj = ({ votes, contestant, }) => {
    const contestantVote = (0, exports.getVotesForAContestant)({
        votes,
        contestant,
    });
    return { votes: contestantVote, ...contestant };
};
/**
 * Builds election details for a contestant's position.
 */
const _buildElectionDetailsObj = ({ votes, contestant, }) => {
    const updatedContestant = _buildContestantsObj({
        votes,
        contestant,
    });
    return {
        positionVotes: (0, exports.getAllVotesForAPosition)({
            votes,
            contestant: updatedContestant,
        }),
        position: updatedContestant.position,
        contestants: [updatedContestant],
    };
};
/**
 * Returns a contestant from a list based on contestant_id.
 */
const _findContestant = (contestants, contestant) => {
    return contestants.find(({ contestant_id }) => contestant_id === contestant.contestant_id);
};
/**
 * Groups contestants by position and attaches vote count per contestant.
 */
const getAllContestantsElectionDetails = ({ contestants, votes, }) => {
    const arrOfContestants = _initializeArrayOfContestants();
    for (let contestant of contestants) {
        const rank = _getCurrentPositionRank(contestant);
        let electionDetailsObj = arrOfContestants[rank];
        if (!electionDetailsObj) {
            electionDetailsObj = _buildElectionDetailsObj({
                votes,
                contestant,
            });
            arrOfContestants[rank] = electionDetailsObj;
        }
        else if (!_findContestant(electionDetailsObj.contestants, contestant)) {
            const updated = _buildContestantsObj({
                votes,
                contestant,
            });
            arrOfContestants[rank].contestants.push(updated);
        }
    }
    return arrOfContestants.filter((contestantObj) => contestantObj !== null);
};
exports.getAllContestantsElectionDetails = getAllContestantsElectionDetails;
/**
 * Checks if a user has already voted.
 */
const userHasVoted = (votes, userId) => {
    return votes.some((voteDetails) => voteDetails.user_id === userId);
};
exports.userHasVoted = userHasVoted;
