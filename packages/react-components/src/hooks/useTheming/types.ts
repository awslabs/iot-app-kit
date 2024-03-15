import { type Theme } from '@cloudscape-design/components/theming';
import { Mode as ThemeMode } from '@cloudscape-design/global-styles';

/** Collection of Cloudscape design tokens supported for theming. */
export type Tokens = Pick<
  Theme['tokens'],
  | 'borderRadiusButton'
  | 'borderRadiusContainer'
  | 'borderRadiusDropdown'
  | 'borderRadiusInput'
  | 'colorBackgroundButtonNormalActive'
  | 'colorBackgroundButtonNormalDefault'
  | 'colorBackgroundButtonNormalDisabled'
  | 'colorBackgroundButtonNormalHover'
  | 'colorBackgroundButtonPrimaryActive'
  | 'colorBackgroundButtonPrimaryDefault'
  | 'colorBackgroundButtonPrimaryDisabled'
  | 'colorBackgroundButtonPrimaryHover'
  | 'colorBorderButtonNormalActive'
  | 'colorBorderButtonNormalDefault'
  | 'colorBorderButtonNormalDisabled'
  | 'colorBorderButtonNormalHover'
  | 'colorBorderButtonPrimaryDisabled'
  | 'colorTextButtonNormalActive'
  | 'colorTextButtonNormalDefault'
  | 'colorTextButtonNormalHover'
  | 'colorTextButtonPrimaryActive'
  | 'colorTextButtonPrimaryDefault'
  | 'colorTextButtonPrimaryHover'
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
