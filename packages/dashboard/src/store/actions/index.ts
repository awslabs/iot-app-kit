import { CreateWidgetsAction } from './createWidget';
import { SelectWidgetsAction } from './selectWidgets';
import { ChangeDashboardWidthAction } from './changeDashboardSize/changeWidth';

export * from './createWidget';
export * from './selectWidgets';
export * from './changeDashboardSize/changeWidth';

export type DashboardAction = CreateWidgetsAction | SelectWidgetsAction | ChangeDashboardWidthAction;
