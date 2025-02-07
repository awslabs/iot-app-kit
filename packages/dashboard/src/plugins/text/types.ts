import type { ComplexFontSettings } from '~/features/widget-customization/settings';

export interface TextWidgetProperties {
  fontSettings?: ComplexFontSettings | undefined;
  value?: string | undefined;
  isUrl?: boolean | undefined;
  href?: string | undefined;
}
