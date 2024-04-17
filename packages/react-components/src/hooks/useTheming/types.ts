import { type Theme } from '@cloudscape-design/components/theming';
import { Mode as ThemeMode } from '@cloudscape-design/global-styles';

/** Collection of Cloudscape design tokens supported for theming. */
export type Tokens = Pick<
  Theme['tokens'],
  | 'borderRadiusButton'
  | 'borderRadiusContainer'
  | 'borderRadiusControlCircularFocusRing'
  | 'borderRadiusControlDefaultFocusRing'
  | 'borderRadiusDropdown'
  | 'borderRadiusInput'
  | 'borderRadiusItem'
  | 'borderRadiusToken'
  | 'colorBackgroundButtonNormalActive'
  | 'colorBackgroundButtonNormalDefault'
  | 'colorBackgroundButtonNormalDisabled'
  | 'colorBackgroundButtonNormalHover'
  | 'colorBackgroundButtonPrimaryActive'
  | 'colorBackgroundButtonPrimaryDefault'
  | 'colorBackgroundButtonPrimaryDisabled'
  | 'colorBackgroundButtonPrimaryHover'
  | 'colorBackgroundControlChecked'
  | 'colorBackgroundControlDefault'
  | 'colorBackgroundControlDisabled'
  | 'colorBackgroundDropdownItemDefault'
  | 'colorBackgroundDropdownItemFilterMatch'
  | 'colorBackgroundDropdownItemHover'
  | 'colorBackgroundInputDefault'
  | 'colorBackgroundInputDisabled'
  | 'colorBackgroundItemSelected'
  | 'colorBorderButtonNormalActive'
  | 'colorBorderButtonNormalDefault'
  | 'colorBorderButtonNormalDisabled'
  | 'colorBorderButtonNormalHover'
  | 'colorBorderButtonPrimaryDisabled'
  | 'colorBorderDropdownItemFocused'
  | 'colorBorderDropdownItemHover'
  | 'colorBorderInputDefault'
  | 'colorBorderInputFocused'
  | 'colorBorderItemFocused'
  | 'colorBorderItemSelected'
  | 'colorForegroundControlDefault'
  | 'colorForegroundControlDisabled'
  | 'colorTextAccent'
  | 'colorTextBodyDefault'
  | 'colorTextBodySecondary'
  | 'colorTextBreadcrumbCurrent'
  | 'colorTextBreadcrumbIcon'
  | 'colorTextButtonNormalActive'
  | 'colorTextButtonNormalDefault'
  | 'colorTextButtonNormalHover'
  | 'colorTextButtonPrimaryActive'
  | 'colorTextButtonPrimaryDefault'
  | 'colorTextButtonPrimaryHover'
  | 'colorTextCounter'
  | 'colorTextDropdownItemFilterMatch'
  | 'colorTextDropdownItemHighlighted'
  | 'colorTextEmpty'
  | 'colorTextFormDefault'
  | 'colorTextFormSecondary'
  | 'colorTextHeadingDefault'
  | 'colorTextHeadingSecondary'
  | 'colorTextInputDisabled'
  | 'colorTextInputPlaceholder'
  | 'colorTextLinkDefault'
  | 'colorTextLinkHover'
  | 'fontFamilyBase'
>;

/**
 * Supported modes for theming.
 *
 * This type matches the `Mode` export from `@cloudscape-design/global-styles`.
 */
export type Mode = ThemeMode;

export interface UseThemeOptions {
  /**
   * Specifies the mode (i.e., color scheme) of the components.
   *
   * @defaultValue `light`
   */
  mode?: 'light' | 'dark';
  /**
   * Specifies design token overrides to change the styling of components.
   */

  tokens?: Tokens;
}
