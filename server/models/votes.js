"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Votes extends Model {
    static associate(models) {
      Votes.belongsTo(models.User, { foreignKey: "user_id" });
      Votes.belongsTo(models.Contestants, { foreignKey: "contestant_id" });
      Votes.belongsTo(models.Election, { foreignKey: "election_id" });
    }
    toJSON() {
      return this.get();
    }
  }

  Votes.init(
    {
      vote_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      election_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      contestant_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      position: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Votes",
      tableName: "votes",
      indexes: [
        { fields: ["election_id"] },
        { fields: ["user_id"] },
        { fields: ["contestant_id"] },
        // Prevent multiple votes by the same user for the same position in one election
        {
          unique: true,
          fields: ["election_id", "user_id", "position"],
          name: "uq_vote_once_per_position_per_election",
        },
      ],
    },
  );
  return Votes;
};
