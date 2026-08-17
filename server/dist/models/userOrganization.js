"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOrganization = void 0;
const sequelize_1 = require("sequelize");
class UserOrganization extends sequelize_1.Model {
    toJSON() {
        return this.get();
    }
    static initModel(sequelize) {
        UserOrganization.init({
            user_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
            organization_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
            role: {
                type: sequelize_1.DataTypes.ENUM("user", "election-manager"),
                allowNull: false,
                defaultValue: "user",
            },
        }, {
            sequelize,
            modelName: "UserOrganization",
            tableName: "user_organizations",
            indexes: [
                {
                    unique: true,
                    fields: ["user_id", "organization_id"],
                    name: "uq_user_org_membership",
                },
            ],
        });
        return UserOrganization;
    }
}
exports.UserOrganization = UserOrganization;
