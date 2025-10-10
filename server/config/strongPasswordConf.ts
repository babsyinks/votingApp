const criteria = [
  {
    message: "Minimum length of 10 characters",
    test: (pwd: string) => pwd.length >= 10,
  },
  {
    message: "At least 1 lowercase character",
    test: (pwd: string) => /[a-z]/.test(pwd),
  },
  {
    message: "At least 1 uppercase character",
    test: (pwd: string) => /[A-Z]/.test(pwd),
  },
  {
    message: "At least 1 number",
    test: (pwd: string) => /[0-9]/.test(pwd),
  },
  {
    message: "At least 1 special character",
    test: (pwd: string) => /[^A-Za-z0-9]/.test(pwd),
  },
];

export default criteria;
