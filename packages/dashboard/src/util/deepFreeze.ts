export const deepFreeze = <T extends object>(obj: T) => {
  for (const key in obj) {
    const value = obj[key];
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  }
  return Object.freeze(obj);
};
