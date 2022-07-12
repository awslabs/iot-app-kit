import { DashboardConfiguration, Widget } from '../types';
import { v4 } from 'uuid';

/**
 * Returns a dashboard configuration with the copy group pasted onto it. Generates
 * new unique ID's for the pasted widgets
 */
export const paste = ({
  dashboardConfiguration,
  copyGroup,
  numTimesCopyGroupHasBeenPasted,
}: {
  dashboardConfiguration: DashboardConfiguration;
  copyGroup: Widget[];
  numTimesCopyGroupHasBeenPasted: number;
}): DashboardConfiguration => {
  return [
    ...dashboardConfiguration,
    ...copyGroup.map((widget) => ({
      ...widget,
      id: v4(),
      x: widget.x + numTimesCopyGroupHasBeenPasted + 1,
      y: widget.y + numTimesCopyGroupHasBeenPasted + 1,
    })),
  ];
};
