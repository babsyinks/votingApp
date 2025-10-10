import express, { Express } from "express";
import request from "supertest";
import * as authController from "../../controllers/authController";
import authRoutes from "../../routes/authRoutes";

jest.mock("../../controllers/authController", () => ({
  requestSignUpCode: jest.fn((req, res) =>
    res.json({ called: "requestSignUpCode" }),
  ),
  verifySignUpCode: jest.fn((req, res) =>
    res.json({ called: "verifySignUpCode" }),
  ),
  register: jest.fn((req, res) => res.json({ called: "register" })),
  signin: jest.fn((req, res) => res.json({ called: "signin" })),
  forgotPassword: jest.fn((req, res) => res.json({ called: "forgotPassword" })),
  resetPassword: jest.fn((req, res) => res.json({ called: "resetPassword" })),
  signout: jest.fn((req, res) => res.json({ called: "signout" })),
}));

describe("authRoutes", () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/", authRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const endpoints = [
    {
      path: "/request-signup-code",
      handler: "requestSignUpCode" as keyof typeof authController,
    },
    {
      path: "/verify-signup-code",
      handler: "verifySignUpCode" as keyof typeof authController,
    },
    { path: "/register", handler: "register" as keyof typeof authController },
    { path: "/signin", handler: "signin" as keyof typeof authController },
    {
      path: "/forgot-password",
      handler: "forgotPassword" as keyof typeof authController,
    },
    {
      path: "/reset-password",
      handler: "resetPassword" as keyof typeof authController,
    },
    { path: "/signout", handler: "signout" as keyof typeof authController },
  ];

  endpoints.forEach(({ path, handler }) => {
    it(`POST ${path} should call authController.${String(handler)}`, async () => {
      const payload = { example: "data" };

      const res = await request(app).post(path).send(payload);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ called: handler });
      expect(authController[handler]).toHaveBeenCalledTimes(1);
      expect(
        (authController[handler] as jest.Mock).mock.calls[0][0].body,
      ).toEqual(payload);
    });
  });
});
