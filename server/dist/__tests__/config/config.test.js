"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config/config"));
describe("Database config", () => {
    it("should export an object with development, test, and production keys", () => {
        expect(config_1.default).toHaveProperty("development");
        expect(config_1.default).toHaveProperty("test");
        expect(config_1.default).toHaveProperty("production");
    });
    it("should have correct development config", () => {
        expect(config_1.default.development).toEqual({
            username: "postgres",
            password: "postgres",
            database: "votingAppDB",
            host: "127.0.0.1",
            dialect: "postgres",
        });
    });
    it("should have correct test config", () => {
        expect(config_1.default.test).toEqual({
            username: "root",
            password: "test",
            database: "database_test",
            host: "127.0.0.1",
            dialect: "postgres",
        });
    });
    it("should have correct production config", () => {
        expect(config_1.default.production).toMatchObject({
            use_env_variable: "DATABASE_URL",
            dialect: "postgres",
            protocol: "postgres",
        });
        expect(config_1.default.production.dialectOptions).toHaveProperty("ssl");
        expect(config_1.default.production.dialectOptions.ssl).toMatchObject({
            require: true,
            rejectUnauthorized: false,
        });
    });
});
