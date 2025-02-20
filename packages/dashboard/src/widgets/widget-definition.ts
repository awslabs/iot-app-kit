import type { ComponentType, ReactNode } from 'react';
import type { DashboardWidgetMap } from './types';
import type { DashboardWidgetInstance } from './configuration';

export interface WidgetDefinition<T extends keyof DashboardWidgetMap> {
  type: T;
  name: string;
  icon: ReactNode;
  render: ComponentType<Extract<DashboardWidgetInstance, { type: T }>>;
  initialProperties: DashboardWidgetMap[T];
  initialSize: {
    height: number;
    width: number;
  };
}
