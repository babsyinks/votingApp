import { Model, DataTypes, Sequelize, Optional } from "sequelize";

import type { Models } from "./types/models";
import electionHooks from "../hooks/electionHooks";

export interface ElectionAttributes {
  election_id: string;
  organization_id: string;
  name: string;
  mode: "demo" | "live";
  slug?: string;
  short_link?: string;
}

export type ElectionCreationAttributes = Optional<
  ElectionAttributes,
  "election_id" | "mode" | "slug" | "short_link"
>;

export class Election
  extends Model<ElectionAttributes, ElectionCreationAttributes>
  implements ElectionAttributes
{
  public election_id!: string;
  public organization_id!: string;
  public name!: string;
  public mode!: "demo" | "live";
  public slug?: string;
  public short_link?: string;

  static associate(models: Models) {
    Election.belongsTo(models.Organization, { foreignKey: "organization_id" });
    Election.hasMany(models.Contestants, { foreignKey: "election_id" });
    Election.hasMany(models.Votes, { foreignKey: "election_id" });
    Election.hasOne(models.Timer, { foreignKey: "election_id" });
  }

  toJSON() {
    return this.get();
  }

  static initModel(sequelize: Sequelize) {
    Election.init(
      {
        election_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        organization_id: { type: DataTypes.UUID, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        mode: {
          type: DataTypes.ENUM("demo", "live"),
          allowNull: false,
          defaultValue: "demo",
        },
        slug: { type: DataTypes.STRING, unique: true },
        short_link: { type: DataTypes.STRING },
      },
      {
        sequelize,
        modelName: "Election",
        tableName: "elections",
        indexes: [{ fields: ["organization_id"] }],
        hooks: {
          beforeCreate: electionHooks.beforeCreate,
          afterCreate: electionHooks.afterCreate,
        },
      },
    );
    return Election;
  }
}
