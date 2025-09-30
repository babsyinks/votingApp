const helmetConfig = require("../../config/helmet");

describe("Helmet content security policy config", () => {
  it("should export a contentSecurityPolicy object with directives", () => {
    expect(helmetConfig).toHaveProperty("contentSecurityPolicy");
    expect(helmetConfig.contentSecurityPolicy).toHaveProperty("directives");
    expect(typeof helmetConfig.contentSecurityPolicy.directives).toBe("object");
  });

  it("should have correct defaultSrc directive", () => {
    expect(helmetConfig.contentSecurityPolicy.directives.defaultSrc).toEqual(["'self'"]);
  });

  it("should have connectSrc containing expected domains", () => {
    expect(helmetConfig.contentSecurityPolicy.directives.connectSrc).toEqual([
      "'self'",
      "https://ka-f.fontawesome.com",
      "https://*.fontawesome.com",
    ]);
  });

  it("should have scriptSrc containing expected domains", () => {
    expect(helmetConfig.contentSecurityPolicy.directives.scriptSrc).toEqual([
      "'self'",
      "https://kit.fontawesome.com",
      "https://ka-f.fontawesome.com",
      "https://*.fontawesome.com",
    ]);
  });

  it("should have styleSrc containing 'unsafe-inline'", () => {
    const styleSrc = helmetConfig.contentSecurityPolicy.directives.styleSrc;
    expect(styleSrc).toContain("'unsafe-inline'");
  });

  it("should have fontSrc containing fonts.gstatic.com", () => {
    const fontSrc = helmetConfig.contentSecurityPolicy.directives.fontSrc;
    expect(fontSrc).toContain("https://fonts.gstatic.com");
  });

  it("should have imgSrc allowing self, fontawesome, i.ibb.co and data URIs", () => {
    expect(helmetConfig.contentSecurityPolicy.directives.imgSrc).toEqual([
      "'self'",
      "https://*.fontawesome",
      "https://i.ibb.co",
      "data:",
    ]);
  });

  it("should have baseUri set to self", () => {
    expect(helmetConfig.contentSecurityPolicy.directives.baseUri).toEqual(["'self'"]);
  });
});
