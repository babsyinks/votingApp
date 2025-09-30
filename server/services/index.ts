/* eslint-disable import/order */
const {
  Votes,
  Contestants,
  Timer,
  User,
  Code,
  Organization,
  UserOrganization,
  Election,
} = require("../models");

const votesService = require("./votesService")(Votes);
const contestantsService = require("./contestantsService")(Contestants);
const timerService = require("./timerService")(Timer);
const codeService = require("./codeService")(Code);
const userService = require("./userService")(User);
const electionService = require("./electionService")({
  votesService,
  contestantsService,
  timerService,
});
const organizationService = require("./organizationService")({
  Organization,
  UserOrganization,
  Election,
});

const authService = {
  ...userService,
  ...codeService,
};

module.exports = {
  votesService,
  contestantsService,
  timerService,
  codeService,
  userService,
  electionService,
  organizationService,
  authService,
};
