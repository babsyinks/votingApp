const criteria = [
  {
    message: "Minimum length of 10 characters",
    test: (pwd) => pwd.length >= 10,
  },
  {
    message: "At least 1 lowercase character",
    test: (pwd) => /[a-z]/.test(pwd),
  },
  {
    message: "At least 1 uppercase character",
    test: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    message: "At least 1 number",
    test: (pwd) => /[0-9]/.test(pwd),
  },
  {
    message: "At least 1 special character",
    test: (pwd) => /[^A-Za-z0-9]/.test(pwd),
  },
];

module.exports = criteria;
