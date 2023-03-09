import { Dispatch, Middleware } from 'redux';
import { DashboardAction } from '~/store/actions';
import { DashboardState } from '~/store/state';
import { WidgetPropertiesGeneratorMap } from '~/customization/widgetPropertiesGeneratorMap';

export const updateWidgetMiddleware: Middleware<unknown, DashboardState, Dispatch<DashboardAction>> =
  () => (next: Dispatch<DashboardAction>) => (action: DashboardAction) => {
    if ('applyUpdateWidget' in action && action.applyUpdateWidget && action.payload?.widgets) {
      return next({
        ...action,
        payload: {
          ...action.payload,
          widgets: action.payload.widgets.map((widget) => {
            const widgetPropertiesGenerator = WidgetPropertiesGeneratorMap[widget.type];
            if (widgetPropertiesGenerator?.onUpdateWidget) {
              return widgetPropertiesGenerator.onUpdateWidget(widget);
            }
            return widget;
          }),
        },
      });
    }
    return next(action);
  };
