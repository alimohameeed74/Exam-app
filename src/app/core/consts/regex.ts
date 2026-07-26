export const REGEX_PATTERNS = {
  USERNAME_PATTERN: /^[a-zA-z][a-zA-z0-9]{3,}$/,
  PASSWORD_PATTERN: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$/,
  NAME_PATTERN: /^[A-Za-z][A-Za-z]+$/,
  PHONE_PATTERN: /^01[0125][0-9]{8}$/,
};
