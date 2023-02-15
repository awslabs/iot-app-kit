import { AppKitComponentTag, AppKitWidget, Widget } from '~/types';

export const appKitWidgetCreator = (componentTag: AppKitComponentTag, preset: Widget): AppKitWidget => {
  return {
    ...preset,
    componentTag,
    widgetId: preset.id,
    assets: [],
    gestures: false, // required in create / edit dashboard mode
  };
};
