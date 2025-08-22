"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Election extends Model {
    static associate(models) {
      Election.belongsTo(models.Organization, { foreignKey: "organization_id" });
      Election.hasMany(models.Contestants, { foreignKey: "election_id" });
      Election.hasMany(models.Votes, { foreignKey: "election_id" });
      Election.hasOne(models.Timer, { foreignKey: "election_id" });
    }

    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }

  Election.init(
    {
      election_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      organization_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
    },
    {
      sequelize,
      modelName: "Election",
      tableName: "elections",
      indexes: [{ fields: ["organization_id"] }],
    }
  );

  return Election;
};
