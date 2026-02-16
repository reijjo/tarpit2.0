export const invalidUsernamePayloads = [
  "bad*name",
  "<script>alert(1)</script>",
  "<img src=x onerror=alert(1)>",
  "admin' OR 1=1 --",
  "admin\" OR \"1\"=\"1",
  "../../etc/passwd",
  "user; DROP TABLE users;",
] as const;

export const invalidEmailPayloads = [
  "not-an-email",
  "test@example.com\nBcc:attacker@example.com",
  "test@example.com\r\nCc:attacker@example.com",
] as const;

export const invalidPasswordCases = [
  {
    label: "without uppercase",
    value: "password1!",
    expectedError: "Must contain one uppercase letter",
  },
  {
    label: "without lowercase",
    value: "PASSWORD1!",
    expectedError: "Must contain one lowercase letter",
  },
  {
    label: "without number",
    value: "Password!",
    expectedError: "Must contain one number",
  },
  {
    label: "without special character",
    value: "Password1",
    expectedError: "Must contain one special character (!@#$%&*_+-=.?)",
  },
] as const;

export const usernameBoundaryCases = [
  {
    label: "too short (2)",
    value: "ab",
    isValid: false,
    expectedError: "Min 3 characters on username",
  },
  {
    label: "min valid (3)",
    value: "abc",
    isValid: true,
    normalized: "abc",
  },
  {
    label: "min valid after trim",
    value: "  abc  ",
    isValid: true,
    normalized: "abc",
  },
  {
    label: "max valid (20)",
    value: "abcdefghijklmnopqrst",
    isValid: true,
    normalized: "abcdefghijklmnopqrst",
  },
  {
    label: "too long (21)",
    value: "abcdefghijklmnopqrstu",
    isValid: false,
    expectedError: "Max 20 characters on username",
  },
] as const;

const boundaryPasswordPrefix = "Aa1!";

export const passwordBoundaryCases = [
  {
    label: "too short (7)",
    value: `${boundaryPasswordPrefix}${"a".repeat(3)}`,
    isValid: false,
    expectedError: "Min 8 characters",
  },
  {
    label: "min valid (8)",
    value: `${boundaryPasswordPrefix}${"a".repeat(4)}`,
    isValid: true,
  },
  {
    label: "max valid (50)",
    value: `${boundaryPasswordPrefix}${"a".repeat(46)}`,
    isValid: true,
  },
  {
    label: "too long (51)",
    value: `${boundaryPasswordPrefix}${"a".repeat(47)}`,
    isValid: false,
    expectedError: "Max 50 characters",
  },
] as const;
