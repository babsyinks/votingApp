import { Model, DataTypes, Sequelize, Optional } from "sequelize";

import type { Models } from "./types/models";

export interface ContestantsAttributes {
  contestant_id: string;
  election_id: string;
  surname: string;
  firstname: string;
  position: string;
  manifesto: string;
  picture: string;
}

export type ContestantsCreationAttributes = Optional<
  ContestantsAttributes,
  "contestant_id"
>;

export class Contestants
  extends Model<ContestantsAttributes, ContestantsCreationAttributes>
  implements ContestantsAttributes
{
  public contestant_id!: string;
  public election_id!: string;
  public surname!: string;
  public firstname!: string;
  public position!: string;
  public manifesto!: string;
  public picture!: string;

  static associate(models: Models) {
    Contestants.belongsTo(models.Election, { foreignKey: "election_id" });
    Contestants.hasMany(models.Votes, { foreignKey: "contestant_id" });
  }

  toJSON() {
    return this.get();
  }

  static initModel(sequelize: Sequelize) {
    Contestants.init(
      {
        contestant_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        election_id: { type: DataTypes.UUID, allowNull: false },
        surname: { type: DataTypes.STRING, allowNull: false },
        firstname: { type: DataTypes.STRING, allowNull: false },
        position: { type: DataTypes.STRING, allowNull: false },
        manifesto: { type: DataTypes.TEXT, allowNull: false },
        picture: { type: DataTypes.STRING, allowNull: false },
      },
      {
        sequelize,
        modelName: "Contestants",
        tableName: "contestants",
        indexes: [{ fields: ["election_id"] }, { fields: ["position"] }],
      },
    );
    return Contestants;
  }
}
