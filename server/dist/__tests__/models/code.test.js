"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const code_1 = require("../../models/code");
describe("Code Model", () => {
    let sequelize;
    beforeAll(() => {
        sequelize = new sequelize_1.Sequelize("sqlite::memory:", { logging: false });
    });
    afterAll(async () => {
        await sequelize.close();
    });
    test("initModel initializes correctly", () => {
        const initSpy = jest.spyOn(code_1.Code, "init");
        code_1.Code.initModel(sequelize);
        expect(initSpy).toHaveBeenCalledWith(expect.objectContaining({
            code_id: expect.any(Object),
            codeHash: expect.any(Object),
            email: expect.any(Object),
            type: expect.any(Object),
            expiresAt: expect.any(Object),
        }), expect.objectContaining({
            sequelize,
            modelName: "Code",
            tableName: "codes",
        }));
        initSpy.mockRestore();
    });
    test("toJSON returns model data via get()", () => {
        code_1.Code.initModel(sequelize);
        const code = code_1.Code.build({
            code_id: "1234",
            codeHash: "hashed123",
            email: "test@example.com",
            type: "signup",
            expiresAt: new Date(),
        });
        const getSpy = jest.spyOn(code, "get");
        const json = code.toJSON();
        expect(getSpy).toHaveBeenCalled();
        expect(json).toMatchObject({
            code_id: "1234",
            codeHash: "hashed123",
            email: "test@example.com",
            type: "signup",
        });
        getSpy.mockRestore();
    });
});
