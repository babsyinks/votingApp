"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Votes = void 0;
const sequelize_1 = require("sequelize");
class Votes extends sequelize_1.Model {
    static associate(models) {
        Votes.belongsTo(models.User, { foreignKey: "user_id" });
        Votes.belongsTo(models.Contestants, { foreignKey: "contestant_id" });
        Votes.belongsTo(models.Election, { foreignKey: "election_id" });
    }
    toJSON() {
        return this.get();
    }
    static initModel(sequelize) {
        Votes.init({
            vote_id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            election_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
            user_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
            contestant_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
            position: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        }, {
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
        });
        return Votes;
    }
}
exports.Votes = Votes;
