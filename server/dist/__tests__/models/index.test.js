"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const models_1 = __importStar(require("../../models"));
describe("Models Index", () => {
    beforeAll(async () => {
        await models_1.sequelize.sync({ force: true });
    });
    afterAll(async () => {
        await models_1.sequelize.close();
    });
    test("sequelize instance is defined", () => {
        expect(models_1.sequelize).toBeDefined();
        expect(models_1.sequelize).toBeInstanceOf(sequelize_1.Sequelize);
    });
    test("all models are initialized", () => {
        const expectedModels = [
            "User",
            "Organization",
            "UserOrganization",
            "Election",
            "Contestants",
            "Timer",
            "Votes",
            "Code",
        ];
        expectedModels.forEach((modelName) => {
            expect(models_1.default[modelName]).toBeDefined();
        });
    });
    test("associations are set up without throwing", () => {
        expect(() => {
            Object.values(models_1.default).forEach((model) => {
                if (model && typeof model.associate === "function") {
                    model.associate(models_1.default);
                }
            });
        }).not.toThrow();
    });
});
