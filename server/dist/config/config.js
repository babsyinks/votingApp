"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const databaseCredentials = {
    development: {
        username: "postgres",
        password: "postgres",
        database: "votingAppDB",
        host: "127.0.0.1",
        dialect: "postgres",
    },
    test: {
        username: "root",
        password: "test",
        database: "database_test",
        host: "127.0.0.1",
        dialect: "postgres",
    },
    production: {
        use_env_variable: "DATABASE_URL",
        dialect: "postgres",
        protocol: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    },
};
exports.default = databaseCredentials;
