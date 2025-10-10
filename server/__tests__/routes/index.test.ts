import request from "supertest";
import express, { Request, Response } from "express";

const mockAuthRoutes = express.Router().get("/", (_req: Request, res: Response) =>
  res.json({ route: "auth" })
);
const mockElectionRoutes = express.Router().get("/", (_req: Request, res: Response) =>
  res.json({ route: "election" })
);
const mockOAuthRoutes = express.Router().get("/", (_req: Request, res: Response) =>
  res.json({ route: "oauth" })
);
const mockRefreshRoute = express.Router().get("/", (_req: Request, res: Response) =>
  res.json({ route: "refresh" })
);
const mockTimerRoutes = express.Router().get("/", (_req: Request, res: Response) =>
  res.json({ route: "timer" })
);

// Define mocks BEFORE dynamic import
jest.mock("../../routes/authRoutes", () => ({
  __esModule: true,
  default: mockAuthRoutes,
}));
jest.mock("../../routes/electionRoutes", () => ({
  __esModule: true,
  default: mockElectionRoutes,
}));
jest.mock("../../routes/oAuthRoutes", () => ({
  __esModule: true,
  default: mockOAuthRoutes,
}));
jest.mock("../../routes/refreshTokenRoute", () => ({
  __esModule: true,
  default: mockRefreshRoute,
}));
jest.mock("../../routes/timerRoutes", () => ({
  __esModule: true,
  default: mockTimerRoutes,
}));

// Dynamically import AFTER mocks are registered
let indexRouter: express.Router;
beforeAll(async () => {
  const mod = await import("../../routes/index");
  indexRouter = mod.default;
});

let app: express.Application;
beforeAll(() => {
  app = express();
  app.use(indexRouter);
});

describe("index.ts routes", () => {
  it("should mount /auth routes", async () => {
    const res = await request(app).get("/auth");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ route: "auth" });
  });

  it("should mount /oauth routes", async () => {
    const res = await request(app).get("/oauth");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ route: "oauth" });
  });

  it("should mount /election routes", async () => {
    const res = await request(app).get("/election");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ route: "election" });
  });

  it("should mount /timer routes", async () => {
    const res = await request(app).get("/timer");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ route: "timer" });
  });

  it("should mount /token routes", async () => {
    const res = await request(app).get("/token");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ route: "refresh" });
  });
});
