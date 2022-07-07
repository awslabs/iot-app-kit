export const validateRuleId = (str: string) => {
  return /^[a-zA-Z_0-9][a-zA-Z_\-0-9]*[a-zA-Z0-9]+$/.test(str);
};
