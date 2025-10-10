import { Model, DataTypes, Sequelize, Optional } from "sequelize";

import type { Models } from "./types/models";

export interface VotesAttributes {
  vote_id: string;
  election_id: string;
  user_id: string;
  contestant_id: string;
  position: string;
}

export type VotesCreationAttributes = Optional<VotesAttributes, "vote_id">;

export class Votes
  extends Model<VotesAttributes, VotesCreationAttributes>
  implements VotesAttributes
{
  public vote_id!: string;
  public election_id!: string;
  public user_id!: string;
  public contestant_id!: string;
  public position!: string;

  static associate(models: Models) {
    Votes.belongsTo(models.User, { foreignKey: "user_id" });
    Votes.belongsTo(models.Contestants, { foreignKey: "contestant_id" });
    Votes.belongsTo(models.Election, { foreignKey: "election_id" });
  }

  toJSON() {
    return this.get();
  }

  static initModel(sequelize: Sequelize) {
    Votes.init(
      {
        vote_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        election_id: { type: DataTypes.UUID, allowNull: false },
        user_id: { type: DataTypes.UUID, allowNull: false },
        contestant_id: { type: DataTypes.UUID, allowNull: false },
        position: { type: DataTypes.STRING, allowNull: false },
      },
      {
        sequelize,
        modelName: "Votes",
        tableName: "votes",
        indexes: [
          { fields: ["election_id"] },
          { fields: ["user_id"] },
          { fields: ["contestant_id"] },
          {
            unique: true,
            fields: ["election_id", "user_id", "position"],
            name: "uq_vote_once_per_position_per_election",
          },
        ],
      },
    );
    return Votes;
  }
}
