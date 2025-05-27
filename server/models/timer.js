"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Timer extends Model {
    // eslint-disable-next-line no-unused-vars
    static associate(models) {}
  }
  Timer.init(
    {
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Timer",
      tableName: "timer",
    },
  );
  return Timer;
};
