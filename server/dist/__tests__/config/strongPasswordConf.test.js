"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strongPasswordConf_1 = __importDefault(require("../../config/strongPasswordConf"));
describe("strongPasswordConf", () => {
    it("should export an array of password criteria", () => {
        expect(Array.isArray(strongPasswordConf_1.default)).toBe(true);
        expect(strongPasswordConf_1.default).toHaveLength(5);
    });
    it("should have correct messages for each criterion", () => {
        const expectedMessages = [
            "Minimum length of 10 characters",
            "At least 1 lowercase character",
            "At least 1 uppercase character",
            "At least 1 number",
            "At least 1 special character",
        ];
        const messages = strongPasswordConf_1.default.map(c => c.message);
        expect(messages).toEqual(expectedMessages);
    });
    describe("Criteria test functions", () => {
        it("should validate minimum length", () => {
            const testFn = strongPasswordConf_1.default[0].test;
            expect(testFn("short")).toBe(false);
            expect(testFn("longenoughpassword")).toBe(true);
        });
        it("should validate presence of lowercase", () => {
            const testFn = strongPasswordConf_1.default[1].test;
            expect(testFn("ABC123!@#")).toBe(false);
            expect(testFn("abc123!@#")).toBe(true);
        });
        it("should validate presence of uppercase", () => {
            const testFn = strongPasswordConf_1.default[2].test;
            expect(testFn("abc123!@#")).toBe(false);
            expect(testFn("Abc123!@#")).toBe(true);
        });
        it("should validate presence of number", () => {
            const testFn = strongPasswordConf_1.default[3].test;
            expect(testFn("Password!")).toBe(false);
            expect(testFn("Password1!")).toBe(true);
        });
        it("should validate presence of special character", () => {
            const testFn = strongPasswordConf_1.default[4].test;
            expect(testFn("Password1")).toBe(false);
            expect(testFn("Password1!")).toBe(true);
        });
    });
});
