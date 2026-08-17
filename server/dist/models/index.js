"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Code = exports.Votes = exports.Timer = exports.Contestants = exports.Election = exports.UserOrganization = exports.Organization = exports.User = exports.Sequelize = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
Object.defineProperty(exports, "Sequelize", { enumerable: true, get: function () { return sequelize_1.Sequelize; } });
const code_1 = require("./code");
Object.defineProperty(exports, "Code", { enumerable: true, get: function () { return code_1.Code; } });
const contestants_1 = require("./contestants");
Object.defineProperty(exports, "Contestants", { enumerable: true, get: function () { return contestants_1.Contestants; } });
const election_1 = require("./election");
Object.defineProperty(exports, "Election", { enumerable: true, get: function () { return election_1.Election; } });
const organization_1 = require("./organization");
Object.defineProperty(exports, "Organization", { enumerable: true, get: function () { return organization_1.Organization; } });
const timer_1 = require("./timer");
Object.defineProperty(exports, "Timer", { enumerable: true, get: function () { return timer_1.Timer; } });
const user_1 = require("./user");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_1.User; } });
const userOrganization_1 = require("./userOrganization");
Object.defineProperty(exports, "UserOrganization", { enumerable: true, get: function () { return userOrganization_1.UserOrganization; } });
const votes_1 = require("./votes");
Object.defineProperty(exports, "Votes", { enumerable: true, get: function () { return votes_1.Votes; } });
const config_1 = __importDefault(require("../config/config"));
const env = (process.env.NODE_ENV || "development");
let sequelize;
if (env === "test") {
    // Override Postgres with SQLite in-memory for tests
    exports.sequelize = sequelize = new sequelize_1.Sequelize("sqlite::memory:", { logging: false });
}
else {
    const config = config_1.default[env];
    if ("use_env_variable" in config) {
        exports.sequelize = sequelize = new sequelize_1.Sequelize(process.env[config.use_env_variable], config);
    }
    else {
        exports.sequelize = sequelize = new sequelize_1.Sequelize(config.database, config.username, config.password, config);
    }
}
// Initialize all models
const models = {
    User: user_1.User.initModel(sequelize),
    Organization: organization_1.Organization.initModel(sequelize),
    UserOrganization: userOrganization_1.UserOrganization.initModel(sequelize),
    Election: election_1.Election.initModel(sequelize),
    Contestants: contestants_1.Contestants.initModel(sequelize),
    Timer: timer_1.Timer.initModel(sequelize),
    Votes: votes_1.Votes.initModel(sequelize),
    Code: code_1.Code.initModel(sequelize),
};
// Run associations
Object.values(models).forEach((model) => {
    if ("associate" in model && typeof model.associate === "function") {
        model.associate(models);
    }
});
exports.default = { ...models, sequelize, Sequelize: sequelize_1.Sequelize };
