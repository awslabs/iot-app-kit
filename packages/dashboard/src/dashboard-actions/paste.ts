import { v4 } from 'uuid';
import { DashboardConfiguration, Position, Widget } from '../types';
import { concatWidgets } from '../util/dashboardConfiguration';

/**
 * Returns a dashboard configuration with the copy group pasted onto it. Generates
 * new unique ID's for the pasted widgets
 */
export const paste = ({
  dashboardConfiguration,
  copyGroup,
  numTimesCopyGroupHasBeenPasted,
  position,
  cellSize,
}: {
  dashboardConfiguration: DashboardConfiguration;
  copyGroup: Widget[];
  numTimesCopyGroupHasBeenPasted: number;
  position?: Position;
  cellSize: number;
}): DashboardConfiguration => {
  const cellPosition: Partial<Position> = {
    x: position && Math.floor(position.x / cellSize),
    y: position && Math.floor(position.y / cellSize),
  };

  return concatWidgets(
    dashboardConfiguration,
    copyGroup.map((widget) => ({
      ...widget,
      id: v4(),
      x: (cellPosition.x ?? widget.x) + numTimesCopyGroupHasBeenPasted + 1,
      y: (cellPosition.y ?? widget.y) + numTimesCopyGroupHasBeenPasted + 1,
    }))
  );
};
