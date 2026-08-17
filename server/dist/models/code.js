"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Code = void 0;
const sequelize_1 = require("sequelize");
class Code extends sequelize_1.Model {
    toJSON() {
        return this.get();
    }
    static initModel(sequelize) {
        Code.init({
            code_id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            codeHash: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            email: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            type: {
                type: sequelize_1.DataTypes.ENUM("signup", "password_reset", "email_change"),
                allowNull: false,
            },
            expiresAt: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        }, {
            sequelize,
            modelName: "Code",
            tableName: "codes",
        });
        return Code;
    }
}
exports.Code = Code;
