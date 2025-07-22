const positionRank = require("../config/electionPositionRank");

/**
 * @typedef {Object} Contestant
 * @property {number} id
 * @property {string} contestant_id
 * @property {string} surname
 * @property {string} firstname
 * @property {string} position
 * @property {string} manifesto
 * @property {string} picture
 */

/**
 * @typedef {Object} Vote
 * @property {number} id
 * @property {string} vote_id
 * @property {string} user_id
 * @property {string} contestant_id
 * @property {string} position
 */

/**
 * creates array of same length as all keys of positionRank object, then fills it with null.
 *
 * @returns {Array}
 */
const _initializeArrayOfContestants = () => {
  return new Array(Object.keys(positionRank).length).fill(null);
};

/**
 * Gets the current rank of a position. The ranks are arranged in ascending order between 0 and 10,
 * with the president having the best rank (0).
 *
 * @param {Contestant} contestant The reference to the contestant
 *
 * @returns {number}
 */
const _getCurrentPositionRank = (contestant) => {
  return positionRank[contestant.position.toLowerCase()];
};

/**
 * Filters the voting data based on the provided property. For example, if the provided property is
 * 'position', it will access the position the contestant is vying for, and return all the data
 * for that position in the votes array
 *
 * @param {Object} param Object parameter
 * @param {Array} [param.votes] Array of objects having voting details of the contestants
 * @param {string} [param.property] The property to use in filtering results, e.g 'position'
 * @param {string} [param.value] The value to use to determine how the votes will be filtered
 *
 * @returns {Vote[]}
 */
const _filterVotesByProperty = ({ votes, property, value }) => {
  return votes.filter((voteDetails) => voteDetails[property] === value);
};

/**
 * Returns an array of ids of voters from an array of voter objects.
 *
 * @param {Array} voters Array to extract all votes from
 * @returns {string[]}
 */
const _getAllVotersId = (voters) => {
  return voters.map((voteDetails) => voteDetails.user_id);
};

/**
 * Returns all votes for a position. E.g, if the position is 'president', it returns all votes cast under
 * this category.
 *
 * @param {{ votes: Vote[], contestant: Contestant, position: string }} param0
 * @returns {string[]}
 */
const getAllVotesForAPosition = ({ votes, contestant, position }) => {
  return _getAllVotersId(
    _filterVotesByProperty({
      votes,
      property: "position",
      value: position || contestant.position,
    }),
  );
};

/**
 * Returns all votes for a given contestant.
 *
 * @param {{ votes: Vote[], contestant: Contestant, contestantId: string }} param0
 * @returns {string[]}
 */
const getVotesForAContestant = ({ votes, contestant, contestantId }) => {
  return _getAllVotersId(
    _filterVotesByProperty({
      votes,
      property: "contestant_id",
      value: contestantId || contestant.contestant_id,
    }),
  );
};

/**
 * Builds the contestant object to be sent to the frontend client
 *
 * @param {{ votes: Vote[], contestant: Contestant}} param0
 * @returns {Object}
 */
const _buildContestantsObj = ({ votes, contestant }) => {
  const contestantVote = getVotesForAContestant({
    votes,
    contestant,
  });
  const updatedContestant = { votes: contestantVote, ...contestant };
  return updatedContestant;
};

/**
 * Adds the built contestant object, total votes, position and contestants to a single consumable
 * object by the frontend.
 *
 * @param {{ votes: Vote[], contestant: Contestant}} param0
 * @returns {Object}
 */
const _buildElectionDetailsObj = ({ votes, contestant }) => {
  contestant = _buildContestantsObj({
    votes,
    contestant,
  });
  const electionDetailsObj = {};
  electionDetailsObj.positionVotes = getAllVotesForAPosition({
    votes,
    contestant,
  });

  electionDetailsObj.position = contestant.position;
  electionDetailsObj.contestants = [contestant];
  return electionDetailsObj;
};

/**
 * Returns a contestant from the contestants list based on the contestant_id of the contestant
 *
 * @param {Contestant[]} contestants List of contestants
 * @param {Contestant} contestant A single contestant
 * @returns {Contestant | undefined}
 */
const _findContestant = (contestants, contestant) => {
  return contestants.find(({ contestant_id }) => contestant_id === contestant.contestant_id);
};

/**
 * Groups contestants by position and attaches vote count per contestant.
 *
 * @param {{ contestants: Contestant[], votes: Vote[] }} param0
 * @returns {Contestant[]}
 */
const getAllContestantsElectionDetails = ({ contestants, votes }) => {
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
    } else if (!_findContestant(electionDetailsObj.contestants, contestant)) {
      contestant = _buildContestantsObj({
        votes,
        contestant,
      });
      arrOfContestants[rank].contestants.push(contestant);
    }
  }
  return arrOfContestants.filter((contestantObj) => contestantObj !== null);
};

/**
 * Checks if a user has already voted.
 *
 * @param {Vote[]} votes
 * @param {string} userId
 *
 * @returns {boolean}
 */
const userHasVoted = (votes, userId) => {
  return votes.find((voteDetails) => voteDetails.user_id === userId);
};

module.exports = {
  getAllContestantsElectionDetails,
  userHasVoted,
  getAllVotesForAPosition,
  getVotesForAContestant,
};
