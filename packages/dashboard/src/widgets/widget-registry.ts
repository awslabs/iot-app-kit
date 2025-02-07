import type { DashboardWidgetMap } from './types';
import type { WidgetDefinition } from './widget-definition';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const widgetRegistry: Record<string, WidgetDefinition<any>> = {};

export function registerWidget<T extends keyof DashboardWidgetMap>(
  registration: WidgetDefinition<T>
): void {
  widgetRegistry[registration.type] = registration;
}

export function getWidgetRegistration<T extends keyof DashboardWidgetMap>(
  type: T
): WidgetDefinition<T> {
  return widgetRegistry[type];
}
