module.exports = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: [
        "'self'",
        "https://ka-f.fontawesome.com",
        "https://*.fontawesome.com",
      ],
      scriptSrc: [
        "'self'",
        "https://kit.fontawesome.com",
        "https://ka-f.fontawesome.com",
        "https://*.fontawesome.com",
      ],
      styleSrc: [
        "'self'",
        "https://fonts.googleapis.com",
        "https://kit.fontawesome.com",
        "https://ka-f.fontawesome.com",
        "https://*.fontawesome.com",
        "'unsafe-inline'",
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://ka-f.fontawesome.com",
        "https://*.fontawesome.com",
        "'unsafe-inline'",
      ],
      imgSrc: ["'self'", "https://*.fontawesome", "https://i.ibb.co", "data:"],
      baseUri: ["'self'"],
    },
  },
};
