const criteria = [
  {
    label: "Minimum length of 10 characters",
    test: (pwd) => pwd.length >= 10,
  },
  {
    label: "At least 1 lowercase character",
    test: (pwd) => /[a-z]/.test(pwd),
  },
  {
    label: "At least 1 uppercase character",
    test: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    label: "At least 1 number",
    test: (pwd) => /[0-9]/.test(pwd),
  },
  {
    label: "At least 1 special character",
    test: (pwd) => /[^A-Za-z0-9]/.test(pwd),
  },
];

export default criteria;
