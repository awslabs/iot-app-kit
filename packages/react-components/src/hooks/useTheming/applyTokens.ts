import { Tokens } from './types';

export const applyTokens = (tokens?: Tokens) => {
  return {
    fontFamilyBase: tokens?.fontFamilyBase,
    borderRadiusButton: tokens?.borderRadiusButton,
    borderRadiusContainer: tokens?.borderRadiusContainer,
    borderRadiusDropdown: tokens?.borderRadiusDropdown,
    borderRadiusInput: tokens?.borderRadiusInput,
    colorBorderButtonNormalActive: tokens?.colorBorderButtonNormalActive,
    colorBorderButtonNormalDefault: tokens?.colorBorderButtonNormalDefault,
    colorBorderButtonNormalDisabled: tokens?.colorBorderButtonNormalDisabled,
    colorBorderButtonNormalHover: tokens?.colorBorderButtonNormalHover,
    colorBorderButtonPrimaryDisabled: tokens?.colorBorderButtonPrimaryDisabled,
  };
};
