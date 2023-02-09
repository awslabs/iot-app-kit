import { TextWidget, Widget } from '../../../../types';

export const textWidgetCreator = (componentTag: 'text', preset: Widget): TextWidget => ({
  ...preset,
  componentTag,
  text: '',
  fontSize: 16,
});
