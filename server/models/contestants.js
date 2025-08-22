"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Contestants extends Model {
    static associate(models) {
      Contestants.belongsTo(models.Election, {
        foreignKey: "election_id",
      });
      Contestants.hasMany(models.Votes, {
        foreignKey: "contestant_id",
      });
    }

    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }
  Contestants.init(
    {
      contestant_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      election_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      position: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      manifesto: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Contestants",
      tableName: "contestants",
      indexes: [{ fields: ["election_id"] }, { fields: ["position"] }],
    },
  );
  return Contestants;
};
