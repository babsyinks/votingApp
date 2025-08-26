describe("services index.js", () => {
  let services;

  beforeEach(() => {
    jest.resetModules();

    jest.mock("../../models", () => ({
      Votes: jest.fn(),
      Contestants: jest.fn(),
      Timer: jest.fn(),
      Code: jest.fn(),
      User: jest.fn(),
      Organization: jest.fn(),
      UserOrganization: jest.fn(),
      Election: jest.fn(),
    }));

    jest.mock("../../services/votesService", () => jest.fn(() => ({ votesService: true })));
    jest.mock("../../services/contestantsService", () =>
      jest.fn(() => ({ contestantsService: true })),
    );
    jest.mock("../../services/timerService", () => jest.fn(() => ({ timerService: true })));
    jest.mock("../../services/codeService", () => jest.fn(() => ({ codeService: true })));
    jest.mock("../../services/userService", () => jest.fn(() => ({ userService: true })));
    jest.mock("../../services/electionService", () => jest.fn(() => ({ electionService: true })));
    jest.mock("../../services/organizationService", () => jest.fn(() => ({ organizationService: true })));

    services = require("../../services");
  });

  it("should export votesService", () => {
    expect(services.votesService).toEqual({ votesService: true });
  });

  it("should export contestantsService", () => {
    expect(services.contestantsService).toEqual({ contestantsService: true });
  });

  it("should export timerService", () => {
    expect(services.timerService).toEqual({ timerService: true });
  });

  it("should export codeService", () => {
    expect(services.codeService).toEqual({ codeService: true });
  });

  it("should export userService", () => {
    expect(services.userService).toEqual({ userService: true });
  });

  it("should export electionService", () => {
    expect(services.electionService).toEqual({ electionService: true });
  });

    it("should export organizationService", () => {
    expect(services.organizationService).toEqual({ organizationService: true });
  });

  it("should export authService merging userService and codeService", () => {
    expect(services.authService).toEqual({
      userService: true,
      codeService: true,
    });
  });
});
