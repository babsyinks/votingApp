"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Votes extends Model {
    static associate(models) {
      Votes.belongsTo(models.User, {
        foreignKey: "user_id",
      });
      Votes.belongsTo(models.Contestants, {
        foreignKey: "contestant_id",
      });
    }
    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }
  Votes.init(
    {
      vote_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
    },
  );
  return Votes;
};
