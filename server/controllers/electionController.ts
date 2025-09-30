const { electionService } = require("../services");

const addNewContestant = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const { surname, firstName, post, manifesto } = req.body;
    const newContestant = await electionService.createContestant({
      surname,
      firstname: firstName,
      position: post,
      manifesto,
      picture: req.file.path,
    });

    res.status(201).json({ message: "success", contestant: newContestant });
  } catch (error) {
    next(error);
  }
};

const getElectionDetails = async (req, res, next) => {
  try {
    const user = req.user;
    const summary = await electionService.getElectionSummary();
    res.json({
      electionData: summary,
      userId: user.user_id,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

const castVote = async (req, res, next) => {
  try {
    const { userId, contestantId, position } = req.body;
    if (!userId || !contestantId || !position) {
      return res.status(400).json({ message: "malformed request" });
    }
    const { positionVotes, contestantVotes } = await electionService.castVote(
      userId,
      contestantId,
      position,
    );
    res.json({ positionVotes, contestantVotes });
  } catch (error) {
    next(error);
  }
};

const deleteElection = async (req, res, next) => {
  try {
    await electionService.clearElectionData();
    res.json({ message: "success" });
  } catch (err) {
    next(err);
  }
};
module.exports = { addNewContestant, getElectionDetails, castVote, deleteElection };
