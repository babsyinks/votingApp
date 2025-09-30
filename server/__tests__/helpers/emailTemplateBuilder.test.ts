const emailTemplateBuilder = require("../../helpers/emailTemplateBuilder");

describe("emailTemplateBuilder", () => {
  const currentYear = new Date().getFullYear();

  it("should build email template with heading, content (main button), and footnote", () => {
    const html = emailTemplateBuilder({
      heading: "Welcome!",
      content: [
        {
          message: "Click below to confirm your account.",
          linkDetails: {
            url: "https://example.com/confirm",
            btnValue: "Confirm Account",
            isMainBtn: true,
          },
        },
      ],
      footNote: "You can ignore this if you didn't sign up.",
    });

    expect(html).toContain("<h2");
    expect(html).toContain("Welcome!");
    expect(html).toContain("Click below to confirm your account.");
    expect(html).toContain("Confirm Account");
    expect(html).toContain("https://example.com/confirm");
    expect(html).toContain("background-color: #3b82f6;");
    expect(html).toContain("You can ignore this if you didn't sign up.");
    expect(html).toContain(`&copy; ${currentYear} Corestack Technologies`);
  });

  it("should build email template without footnote", () => {
    const html = emailTemplateBuilder({
      heading: "No Footnote",
      content: [
        {
          message: "Message without footnote.",
          linkDetails: {
            url: "https://example.com/test",
            btnValue: "Test",
            isMainBtn: true,
          },
        },
      ],
    });

    expect(html).toContain("No Footnote");
    expect(html).toContain("Message without footnote.");
    expect(html).toContain("Test");
    expect(html).not.toContain("font-size: 14px; color: #888; text-align: center;");
  });

  it("should render non-main button style when isMainBtn is false", () => {
    const html = emailTemplateBuilder({
      heading: "Secondary Button",
      content: [
        {
          message: "This is a secondary action.",
          linkDetails: {
            url: "https://example.com/secondary",
            btnValue: "Secondary Action",
            isMainBtn: false,
          },
        },
      ],
    });

    expect(html).toContain("font-size: 14px; color: #666; text-align: center;");
    expect(html).toContain("background-color: #d62222ff;");
    expect(html).toContain("Secondary Action");
  });

  it("should handle content without linkDetails", () => {
    const html = emailTemplateBuilder({
      heading: "Text Only",
      content: [
        {
          message: "Just a message, no button.",
        },
      ],
    });

    expect(html).toContain("Just a message, no button.");
    expect(html).not.toContain("<a href=");
  });

  it("should handle multiple content items", () => {
    const html = emailTemplateBuilder({
      heading: "Multiple Items",
      content: [
        {
          message: "First message.",
          linkDetails: {
            url: "https://example.com/first",
            btnValue: "First",
            isMainBtn: true,
          },
        },
        {
          message: "Second message.",
          linkDetails: {
            url: "https://example.com/second",
            btnValue: "Second",
            isMainBtn: false,
          },
        },
        {
          message: "Third message, no button.",
        },
      ],
    });

    expect(html).toContain("First message.");
    expect(html).toContain("background-color: #3b82f6;");
    expect(html).toContain("Second message.");
    expect(html).toContain("background-color: #d62222ff;");
    expect(html).toContain("Third message, no button.");
  });
});
