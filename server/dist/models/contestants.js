"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contestants = void 0;
const sequelize_1 = require("sequelize");
class Contestants extends sequelize_1.Model {
    static associate(models) {
        Contestants.belongsTo(models.Election, { foreignKey: "election_id" });
        Contestants.hasMany(models.Votes, { foreignKey: "contestant_id" });
    }
    toJSON() {
        return this.get();
    }
    static initModel(sequelize) {
        Contestants.init({
            contestant_id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            election_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
            surname: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            firstname: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            position: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            manifesto: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
            picture: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        }, {
            sequelize,
            modelName: "Contestants",
            tableName: "contestants",
            indexes: [{ fields: ["election_id"] }, { fields: ["position"] }],
        });
        return Contestants;
    }
}
exports.Contestants = Contestants;
