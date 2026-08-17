"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helmet_1 = __importDefault(require("../../config/helmet"));
describe("Helmet content security policy config", () => {
    it("should export a contentSecurityPolicy object with directives", () => {
        expect(helmet_1.default).toHaveProperty("contentSecurityPolicy");
        expect(helmet_1.default.contentSecurityPolicy).toHaveProperty("directives");
        expect(typeof helmet_1.default.contentSecurityPolicy.directives).toBe("object");
    });
    it("should have correct defaultSrc directive", () => {
        expect(helmet_1.default.contentSecurityPolicy.directives.defaultSrc).toEqual(["'self'"]);
    });
    it("should have connectSrc containing expected domains", () => {
        expect(helmet_1.default.contentSecurityPolicy.directives.connectSrc).toEqual([
            "'self'",
            "https://ka-f.fontawesome.com",
            "https://*.fontawesome.com",
        ]);
    });
    it("should have scriptSrc containing expected domains", () => {
        expect(helmet_1.default.contentSecurityPolicy.directives.scriptSrc).toEqual([
            "'self'",
            "https://kit.fontawesome.com",
            "https://ka-f.fontawesome.com",
            "https://*.fontawesome.com",
        ]);
    });
    it("should have styleSrc containing 'unsafe-inline'", () => {
        const styleSrc = helmet_1.default.contentSecurityPolicy.directives.styleSrc;
        expect(styleSrc).toContain("'unsafe-inline'");
    });
    it("should have fontSrc containing fonts.gstatic.com", () => {
        const fontSrc = helmet_1.default.contentSecurityPolicy.directives.fontSrc;
        expect(fontSrc).toContain("https://fonts.gstatic.com");
    });
    it("should have imgSrc allowing self, fontawesome, i.ibb.co and data URIs", () => {
        expect(helmet_1.default.contentSecurityPolicy.directives.imgSrc).toEqual([
            "'self'",
            "https://*.fontawesome",
            "https://i.ibb.co",
            "data:",
        ]);
    });
    it("should have baseUri set to self", () => {
        expect(helmet_1.default.contentSecurityPolicy.directives.baseUri).toEqual(["'self'"]);
    });
});
