/* eslint-disable import/order */
import {
  Votes,
  Contestants,
  Timer,
  User,
  Code,
  Organization,
  UserOrganization,
  Election,
} from "../models";

import createVotesService from "../services/votesService";
import createContestantsService from "./contestantsService";
import createTimerService from "./timerService";
import createCodeService from "./codeService";
import createUserService from "./userService";
import createElectionService from "./electionService";
import createOrganizationService from "./organizationService";

export const votesService = createVotesService(Votes);
export const contestantsService = createContestantsService(Contestants);
export const timerService = createTimerService(Timer);
export const codeService = createCodeService(Code);
export const userService = createUserService(User);
export const electionService = createElectionService({
  votesService,
  contestantsService,
  timerService,
});
export const organizationService = createOrganizationService(
  Organization,
  UserOrganization,
  Election,
);

export const authService = {
  ...userService,
  ...codeService,
};

export default {
  votesService,
  contestantsService,
  timerService,
  codeService,
  userService,
  electionService,
  organizationService,
  authService,
};
