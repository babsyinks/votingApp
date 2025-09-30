"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Timer extends Model {
    static associate(models) {
      Timer.belongsTo(models.Election, { foreignKey: "election_id" });
    }
  }

  Timer.init(
    {
      timer_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      election_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Timer",
      tableName: "timers",
      indexes: [
        {
          unique: true,
          fields: ["election_id"],
          name: "uq_timer_per_election",
        },
      ],
    },
  );
  return Timer;
};
