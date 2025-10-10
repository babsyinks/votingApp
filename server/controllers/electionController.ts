import { Request, Response, NextFunction } from "express";

import type { UserAttributesWithRoles } from "../models/user";
import { electionService } from "../services";

// Extend Express Request to include `user` (since you access req.user)
export interface AuthenticatedRequest extends Request {
  user: UserAttributesWithRoles;
}

/**
 * Handles uploading and creating a new contestant record.
 */
export const addNewContestant = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const { surname, firstName, post, manifesto, election_id } = req.body;

    const newContestant = await electionService.createContestant({
      surname,
      firstname: firstName,
      position: post,
      manifesto,
      picture: req.file.path,
      election_id,
    });

    res.status(201).json({ message: "success", contestant: newContestant });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetches election summary and user details.
 */
export const getElectionDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = (req as AuthenticatedRequest).user;
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

/**
 * Handles casting of votes by a user.
 */
export const castVote = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId, contestantId, electionId, position } = req.body;

    if (![userId, contestantId, electionId, position].every(Boolean)) {
      res.status(400).json({ message: "malformed request" });
      return;
    }

    const { positionVotes, contestantVotes } = await electionService.castVote(
      userId,
      contestantId,
      position,
      electionId,
    );

    res.json({ positionVotes, contestantVotes });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes all election data (admin only).
 */
export const deleteElection = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await electionService.clearElectionData();
    res.json({ message: "success" });
  } catch (error) {
    next(error);
  }
};

export default {
  addNewContestant,
  getElectionDetails,
  castVote,
  deleteElection,
};
