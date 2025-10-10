import { Sequelize } from "sequelize";

import { Code } from "./code";
import { Contestants } from "./contestants";
import { Election } from "./election";
import { Organization } from "./organization";
import { Timer } from "./timer";
import type { Models } from "./types/models";
import { User } from "./user";
import { UserOrganization } from "./userOrganization";
import { Votes } from "./votes";
import configFile from "../config/config";

type NodeEnv = keyof typeof configFile;
const env = (process.env.NODE_ENV || "development") as NodeEnv;

let sequelize: Sequelize;

if (env === "test") {
  // Override Postgres with SQLite in-memory for tests
  sequelize = new Sequelize("sqlite::memory:", { logging: false });
} else {
  const config = configFile[env];
  if ("use_env_variable" in config) {
    sequelize = new Sequelize(
      process.env[config.use_env_variable] as string,
      config,
    );
  } else {
    sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      config,
    );
  }
}

// Initialize all models
const models: Models = {
  User: User.initModel(sequelize),
  Organization: Organization.initModel(sequelize),
  UserOrganization: UserOrganization.initModel(sequelize),
  Election: Election.initModel(sequelize),
  Contestants: Contestants.initModel(sequelize),
  Timer: Timer.initModel(sequelize),
  Votes: Votes.initModel(sequelize),
  Code: Code.initModel(sequelize),
};

// Run associations
Object.values(models).forEach((model) => {
  if ("associate" in model && typeof model.associate === "function") {
    model.associate(models);
  }
});

export { sequelize, Sequelize };
export {
  User,
  Organization,
  UserOrganization,
  Election,
  Contestants,
  Timer,
  Votes,
  Code,
};
export default { ...models, sequelize, Sequelize };
