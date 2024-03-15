import { Tokens } from './types';

export const applyTokens = (tokens?: Tokens) => {
  return {
    fontFamilyBase: tokens?.fontFamilyBase,
  };
};
