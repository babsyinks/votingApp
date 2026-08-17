"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
    static associate(models) {
        User.belongsToMany(models.Organization, {
            through: models.UserOrganization,
            foreignKey: "user_id",
            otherKey: "organization_id",
        });
        User.hasMany(models.Votes, { foreignKey: "user_id" });
    }
    // Override toJSON for cleaner output
    toJSON() {
        const attributes = { ...this.get() };
        return {
            ...attributes,
            // role is set to admin or user initially. When user wants to access an organization resource,
            // the role of the user is determined at the organization level using the userOrganization
            // model to determine if the user is a member (if so what role do they have there) or not.
            role: this.isAdmin ? "admin" : "user",
        };
    }
    static initModel(sequelize) {
        User.init({
            user_id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            username: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
            password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            email: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
            firstname: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            lastname: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            isAdmin: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        }, {
            sequelize,
            modelName: "User",
            tableName: "users",
            indexes: [{ fields: ["username"] }, { fields: ["email"] }],
        });
        return User;
    }
}
exports.User = User;
