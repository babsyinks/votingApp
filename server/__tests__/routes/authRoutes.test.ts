const express = require("express");
const request = require("supertest");

jest.mock("../../controllers/authController", () => ({
  requestSignUpCode: jest.fn((req, res) => res.json({ called: "requestSignUpCode" })),
  verifySignUpCode: jest.fn((req, res) => res.json({ called: "verifySignUpCode" })),
  register: jest.fn((req, res) => res.json({ called: "register" })),
  signin: jest.fn((req, res) => res.json({ called: "signin" })),
  forgotPassword: jest.fn((req, res) => res.json({ called: "forgotPassword" })),
  resetPassword: jest.fn((req, res) => res.json({ called: "resetPassword" })),
  signout: jest.fn((req, res) => res.json({ called: "signout" })),
}));
const authController = require("../../controllers/authController");

const authRoutes = require("../../routes/authRoutes");

describe("authRoutes", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/", authRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const endpoints = [
    { path: "/request-signup-code", handler: "requestSignUpCode" },
    { path: "/verify-signup-code", handler: "verifySignUpCode" },
    { path: "/register", handler: "register" },
    { path: "/signin", handler: "signin" },
    { path: "/forgot-password", handler: "forgotPassword" },
    { path: "/reset-password", handler: "resetPassword" },
    { path: "/signout", handler: "signout" },
  ];

  endpoints.forEach(({ path, handler }) => {
    it(`POST ${path} should call authController.${handler}`, async () => {
      const payload = { example: "data" };

      const res = await request(app).post(path).send(payload);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ called: handler });
      expect(authController[handler]).toHaveBeenCalledTimes(1);
      expect(authController[handler].mock.calls[0][0].body).toEqual(payload);
    });
  });
});
