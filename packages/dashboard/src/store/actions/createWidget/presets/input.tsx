import { InputWidget, Widget } from '~/types';

export const inputWidgetCreator = (componentTag: 'input', preset: Widget): InputWidget => ({
  ...preset,
  componentTag,
  assets: [],
  properties: {
    options: [],
  },
});
