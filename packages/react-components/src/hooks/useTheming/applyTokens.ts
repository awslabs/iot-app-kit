import { Tokens } from './types';

export const applyTokens = (tokens?: Tokens) => {
  return {
    fontFamilyBase: tokens?.fontFamilyBase,
    borderRadiusButton: tokens?.borderRadiusButton,
    borderRadiusContainer: tokens?.borderRadiusContainer,
    borderRadiusDropdown: tokens?.borderRadiusDropdown,
    borderRadiusInput: tokens?.borderRadiusInput,
    colorBackgroundButtonNormalActive:
      tokens?.colorBackgroundButtonNormalActive,
    colorBackgroundButtonNormalDefault:
      tokens?.colorBackgroundButtonNormalDefault,
    colorBackgroundButtonNormalDisabled:
      tokens?.colorBackgroundButtonNormalDisabled,
    colorBackgroundButtonNormalHover: tokens?.colorBackgroundButtonNormalHover,
    colorBackgroundButtonPrimaryActive:
      tokens?.colorBackgroundButtonPrimaryActive,
    colorBackgroundButtonPrimaryDefault:
      tokens?.colorBackgroundButtonPrimaryDefault,
    colorBackgroundButtonPrimaryDisabled:
      tokens?.colorBackgroundButtonPrimaryDisabled,
    colorBackgroundButtonPrimaryHover:
      tokens?.colorBackgroundButtonPrimaryHover,
    colorBorderButtonNormalActive: tokens?.colorBorderButtonNormalActive,
    colorBorderButtonNormalDefault: tokens?.colorBorderButtonNormalDefault,
    colorBorderButtonNormalDisabled: tokens?.colorBorderButtonNormalDisabled,
    colorBorderButtonNormalHover: tokens?.colorBorderButtonNormalHover,
    colorBorderButtonPrimaryDisabled: tokens?.colorBorderButtonPrimaryDisabled,
    colorTextButtonNormalActive: tokens?.colorTextButtonNormalActive,
    colorTextButtonNormalDefault: tokens?.colorTextButtonNormalDefault,
    colorTextButtonNormalHover: tokens?.colorTextButtonNormalHover,
    colorTextButtonPrimaryActive: tokens?.colorTextButtonPrimaryActive,
    colorTextButtonPrimaryDefault: tokens?.colorTextButtonPrimaryDefault,
    colorTextButtonPrimaryHover: tokens?.colorTextButtonPrimaryHover,
  };
};
