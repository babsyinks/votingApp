"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Election = void 0;
const sequelize_1 = require("sequelize");
const electionHooks_1 = __importDefault(require("../hooks/electionHooks"));
class Election extends sequelize_1.Model {
    static associate(models) {
        Election.belongsTo(models.Organization, { foreignKey: "organization_id" });
        Election.hasMany(models.Contestants, { foreignKey: "election_id" });
        Election.hasMany(models.Votes, { foreignKey: "election_id" });
        Election.hasOne(models.Timer, { foreignKey: "election_id" });
    }
    toJSON() {
        return this.get();
    }
    static initModel(sequelize) {
        Election.init({
            election_id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            organization_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
            name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            mode: {
                type: sequelize_1.DataTypes.ENUM("demo", "live"),
                allowNull: false,
                defaultValue: "demo",
            },
            slug: { type: sequelize_1.DataTypes.STRING, unique: true },
            short_link: { type: sequelize_1.DataTypes.STRING },
        }, {
            sequelize,
            modelName: "Election",
            tableName: "elections",
            indexes: [{ fields: ["organization_id"] }],
            hooks: {
                beforeCreate: electionHooks_1.default.beforeCreate,
                afterCreate: electionHooks_1.default.afterCreate,
            },
        });
        return Election;
    }
}
exports.Election = Election;
