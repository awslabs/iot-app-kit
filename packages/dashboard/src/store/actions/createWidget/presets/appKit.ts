import { MOCK_LINE_CHART_WIDGET } from '../../../../../testing/mocks';
import { AppKitComponentTag, AppKitWidget, Widget } from '../../../../types';

export const appKitWidgetCreator = (componentTag: AppKitComponentTag, preset: Widget): AppKitWidget => {
  return {
    ...preset,
    componentTag,
    widgetId: preset.id,
    assets: MOCK_LINE_CHART_WIDGET.assets,
    gestures: false, // required in create / edit dashboard mode
  };
};
