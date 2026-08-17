"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
const sequelize_1 = require("sequelize");
class Timer extends sequelize_1.Model {
    static associate(models) {
        Timer.belongsTo(models.Election, { foreignKey: "election_id" });
    }
    static initModel(sequelize) {
        Timer.init({
            timer_id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            election_id: { type: sequelize_1.DataTypes.UUID, allowNull: false, unique: true },
            startDate: sequelize_1.DataTypes.DATE,
            endDate: sequelize_1.DataTypes.DATE,
        }, {
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
        });
        return Timer;
    }
}
exports.Timer = Timer;
