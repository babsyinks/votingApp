"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Organization = void 0;
const sequelize_1 = require("sequelize");
class Organization extends sequelize_1.Model {
    static associate(models) {
        Organization.hasMany(models.Election, { foreignKey: "organization_id" });
        Organization.belongsToMany(models.User, {
            through: models.UserOrganization,
            foreignKey: "organization_id",
            otherKey: "user_id",
        });
    }
    toJSON() {
        return this.get();
    }
    static initModel(sequelize) {
        Organization.init({
            organization_id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
            description: { type: sequelize_1.DataTypes.TEXT },
        }, {
            sequelize,
            modelName: "Organization",
            tableName: "organizations",
        });
        return Organization;
    }
}
exports.Organization = Organization;
