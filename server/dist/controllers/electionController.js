"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteElection = exports.castVote = exports.getElectionDetails = exports.addNewContestant = void 0;
const services_1 = require("../services");
/**
 * Handles uploading and creating a new contestant record.
 */
const addNewContestant = async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }
        const { surname, firstName, post, manifesto, election_id } = req.body;
        const newContestant = await services_1.electionService.createContestant({
            surname,
            firstname: firstName,
            position: post,
            manifesto,
            picture: req.file.path,
            election_id,
        });
        res.status(201).json({ message: "success", contestant: newContestant });
    }
    catch (error) {
        next(error);
    }
};
exports.addNewContestant = addNewContestant;
/**
 * Fetches election summary and user details.
 */
const getElectionDetails = async (req, res, next) => {
    try {
        const user = req.user;
        const summary = await services_1.electionService.getElectionSummary();
        res.json({
            electionData: summary,
            userId: user.user_id,
            username: user.username,
            role: user.role,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getElectionDetails = getElectionDetails;
/**
 * Handles casting of votes by a user.
 */
const castVote = async (req, res, next) => {
    try {
        const { userId, contestantId, electionId, position } = req.body;
        if (![userId, contestantId, electionId, position].every(Boolean)) {
            res.status(400).json({ message: "malformed request" });
            return;
        }
        const { positionVotes, contestantVotes } = await services_1.electionService.castVote(userId, contestantId, position, electionId);
        res.json({ positionVotes, contestantVotes });
    }
    catch (error) {
        next(error);
    }
};
exports.castVote = castVote;
/**
 * Deletes all election data (admin only).
 */
const deleteElection = async (req, res, next) => {
    try {
        await services_1.electionService.clearElectionData();
        res.json({ message: "success" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteElection = deleteElection;
exports.default = {
    addNewContestant: exports.addNewContestant,
    getElectionDetails: exports.getElectionDetails,
    castVote: exports.castVote,
    deleteElection: exports.deleteElection,
};
