import { v4 } from 'uuid';
import first from 'lodash/first';
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
  let offset: Position = {
    x: 0,
    y: 0,
  };
  if (position !== undefined) {
    const cellPosition: Position = {
      x: position && Math.floor(position.x / cellSize),
      y: position && Math.floor(position.y / cellSize),
    };

    const widgetToCompare = first(copyGroup);
    offset = {
      x: cellPosition.x - (widgetToCompare?.x ?? 0),
      y: cellPosition.y - (widgetToCompare?.y ?? 0),
    };
  }

  return concatWidgets(
    dashboardConfiguration,
    copyGroup.map((widget) => ({
      ...widget,
      id: v4(),
      x: offset.x + widget.x + numTimesCopyGroupHasBeenPasted + 1,
      y: offset.y + widget.y + numTimesCopyGroupHasBeenPasted + 1,
    }))
  );
};
