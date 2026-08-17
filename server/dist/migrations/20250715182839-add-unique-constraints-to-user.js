"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.addConstraint("users", {
            fields: ["email"],
            type: "unique",
            name: "unique_users_email",
        });
        await queryInterface.addConstraint("users", {
            fields: ["username"],
            type: "unique",
            name: "unique_users_username",
        });
    },
    down: async (queryInterface) => {
        await queryInterface.removeConstraint("users", "unique_users_email");
        await queryInterface.removeConstraint("users", "unique_users_username");
    },
};
