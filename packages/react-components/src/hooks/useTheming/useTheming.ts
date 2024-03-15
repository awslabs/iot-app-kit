import { applyMode } from '@cloudscape-design/global-styles';
import { applyTheme } from '@cloudscape-design/components/theming';
import { Mode, UseThemeOptions } from './types';
import { applyTokens } from './applyTokens';

/**
 * Use to set the theme of `iot-app-kit` components.
 *
 * @experimental
 * This API is experimental, is not completely functional, and is subject to
 * breaking changes. Until stabilized, many components will not see styling
 * changes. Do not use in production.
 */

export function useTheme({ mode = 'light', tokens }: UseThemeOptions): void {
  const theme = {
    tokens: applyTokens(tokens),
  };

  applyMode(mode as Mode);
  applyTheme({ theme });
}
