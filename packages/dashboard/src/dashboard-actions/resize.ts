import { DashboardConfiguration, Position, Rect, Anchor } from '../types';
import { getSelectionBox } from '../components/iot-dashboard/getSelectionBox';

/**
 * Resizes the selected widgets according to moving the specified anchor of the selection box.
 *
 * NOTE: Only supports corners currently. Need to add implementation to support 'sides'.
 */
export const resize = ({
  anchor,
  dashboardConfiguration,
  widgetIds,
  changeInPosition,
  cellSize,
}: {
  dashboardConfiguration: DashboardConfiguration;
  anchor: Anchor;
  changeInPosition: Position;
  widgetIds: string[];
  cellSize: number;
}): DashboardConfiguration => {
  const selectionBox = getSelectionBox({ dashboardConfiguration, selectedWidgetIds: widgetIds });
  if (selectionBox == null) {
    return [];
  }
  const { x, y, width, height } = selectionBox;

  if (anchor === 'top') {
    return resizeFromTop({
      selectionBox: { x, y, height, width },
      dashboardConfiguration,
      widgetIds,
      changeInPosition,
      cellSize,
    });
  }

  if (anchor === 'bottom') {
    return resizeFromBottom({
      selectionBox: { x, y, height, width },
      dashboardConfiguration,
      widgetIds,
      changeInPosition,
      cellSize,
    });
  }

  if (anchor === 'left') {
    return resizeFromLeft({
      selectionBox: { x, y, height, width },
      dashboardConfiguration,
      widgetIds,
      changeInPosition,
      cellSize,
    });
  }

  if (anchor === 'right') {
    return resizeFromRight({
      selectionBox: { x, y, height, width },
      dashboardConfiguration,
      widgetIds,
      changeInPosition,
      cellSize,
    });
  }

  if (anchor === 'bottom-right') {
    return resizeFromBottomRight({
      selectionBox: { x, y, height, width },
      dashboardConfiguration,
      widgetIds,
      changeInPosition,
      cellSize,
    });
  }

  if (anchor === 'top-left') {
    return resizeFromTopLeft({
      selectionBox: { x, y, height, width },
      dashboardConfiguration,
      widgetIds,
      changeInPosition,
      cellSize,
    });
  }

  if (anchor === 'top-right') {
    return resizeFromTopRight({
      selectionBox: { x, y, height, width },
      dashboardConfiguration,
      widgetIds,
      changeInPosition,
      cellSize,
    });
  }

  if (anchor === 'bottom-left') {
    return resizeFromBottomLeft({
      selectionBox: { x, y, height, width },
      dashboardConfiguration,
      widgetIds,
      changeInPosition,
      cellSize,
    });
  }

  return dashboardConfiguration;
};

const resizeFromTop = ({
  selectionBox: { x, y, width, height },
  dashboardConfiguration,
  widgetIds,
  changeInPosition,
  cellSize,
}: {
  selectionBox: Rect;
  dashboardConfiguration: DashboardConfiguration;
  changeInPosition: Position;
  widgetIds: string[];
  cellSize: number;
}): DashboardConfiguration => {
  const anchorPosition = {
    x: (x + width - 1) * cellSize,
    y: (y - 1) * cellSize,
  };
  const yScale = Math.max(1 - changeInPosition.y / (height * cellSize), 0);

  const currentGridY = (anchorPosition.y + changeInPosition.y) / cellSize + 1;

  return dashboardConfiguration.map((widget) => {
    const isWidgetSelected = widgetIds.includes(widget.id);
    if (!isWidgetSelected) {
      // Only apply resize to selected widgets, so we do nothing.
      return widget;
    }
    // Apply scalar transformation to widget
    return {
      ...widget,
      y: currentGridY + (widget.y - y) * yScale,
      height: widget.height * yScale,
    };
  });
};

const resizeFromTopRight = ({
  selectionBox: { x, y, width, height },
  dashboardConfiguration,
  widgetIds,
  changeInPosition,
  cellSize,
}: {
  selectionBox: Rect;
  dashboardConfiguration: DashboardConfiguration;
  changeInPosition: Position;
  widgetIds: string[];
  cellSize: number;
}): DashboardConfiguration => {
  const anchorPosition = {
    x: (x + width - 1) * cellSize,
    y: (y - 1) * cellSize,
  };
  const xScale = Math.max(1 + changeInPosition.x / (width * cellSize), 0);
  const yScale = Math.max(1 - changeInPosition.y / (height * cellSize), 0);

  const currentGridY = (anchorPosition.y + changeInPosition.y) / cellSize + 1;

  return dashboardConfiguration.map((widget) => {
    const isWidgetSelected = widgetIds.includes(widget.id);
    if (!isWidgetSelected) {
      // Only apply resize to selected widgets, so we do nothing.
      return widget;
    }
    // Apply scalar transformation to widget
    return {
      ...widget,
      x: x + (widget.x - x) * xScale,
      y: currentGridY + (widget.y - y) * yScale,
      width: widget.width * xScale,
      height: widget.height * yScale,
    };
  });
};

const resizeFromRight = ({
  selectionBox: { x, width },
  dashboardConfiguration,
  widgetIds,
  changeInPosition,
  cellSize,
}: {
  selectionBox: Rect;
  dashboardConfiguration: DashboardConfiguration;
  changeInPosition: Position;
  widgetIds: string[];
  cellSize: number;
}): DashboardConfiguration => {
  const xScale = Math.max(1 + changeInPosition.x / (width * cellSize), 0);

  return dashboardConfiguration.map((widget) => {
    const isWidgetSelected = widgetIds.includes(widget.id);
    if (!isWidgetSelected) {
      // Only apply resize to selected widgets, so we do nothing.
      return widget;
    }
    // Apply scalar transformation to widget
    return {
      ...widget,
      x: x + (widget.x - x) * xScale,
      width: widget.width * xScale,
    };
  });
};

const resizeFromBottomRight = ({
  selectionBox: { x, y, width, height },
  dashboardConfiguration,
  widgetIds,
  changeInPosition,
  cellSize,
}: {
  selectionBox: Rect;
  dashboardConfiguration: DashboardConfiguration;
  changeInPosition: Position;
  widgetIds: string[];
  cellSize: number;
}): DashboardConfiguration => {
  const xScale = Math.max(1 + changeInPosition.x / (width * cellSize), 0);
  const yScale = Math.max(1 + changeInPosition.y / (height * cellSize), 0);

  return dashboardConfiguration.map((widget) => {
    const isWidgetSelected = widgetIds.includes(widget.id);
    if (!isWidgetSelected) {
      // Only apply resize to selected widgets, so we do nothing.
      return widget;
    }
    // Apply scalar transformation to widget
    return {
      ...widget,
      x: x + (widget.x - x) * xScale,
      y: y + (widget.y - y) * yScale,
      width: widget.width * xScale,
      height: widget.height * yScale,
    };
  });
};

const resizeFromLeft = ({
  selectionBox: { x, y, width, height },
  dashboardConfiguration,
  widgetIds,
  changeInPosition,
  cellSize,
}: {
  selectionBox: Rect;
  dashboardConfiguration: DashboardConfiguration;
  changeInPosition: Position;
  widgetIds: string[];
  cellSize: number;
}): DashboardConfiguration => {
  const anchorPosition = {
    x: (x - 1) * cellSize,
    y: (y + height - 1) * cellSize,
  };
  const currPosition = { x: anchorPosition.x + changeInPosition.x, y: anchorPosition.y + changeInPosition.y };
  const xScale = Math.max(1 + (anchorPosition.x - currPosition.x) / (width * cellSize), 0);

  const currentGridX = currPosition.x / cellSize + 1;

  return dashboardConfiguration.map((widget) => {
    const isWidgetSelected = widgetIds.includes(widget.id);
    if (!isWidgetSelected) {
      // Only apply resize to selected widgets, so we do nothing.
      return widget;
    }
    // Apply scalar transformation to widget
    return {
      ...widget,
      x: currentGridX + (widget.x - x) * xScale,
      width: widget.width * xScale,
    };
  });
};

const resizeFromBottomLeft = ({
  selectionBox: { x, y, width, height },
  dashboardConfiguration,
  widgetIds,
  changeInPosition,
  cellSize,
}: {
  selectionBox: Rect;
  dashboardConfiguration: DashboardConfiguration;
  changeInPosition: Position;
  widgetIds: string[];
  cellSize: number;
}): DashboardConfiguration => {
  const anchorPosition = {
    x: (x - 1) * cellSize,
    y: (y + height - 1) * cellSize,
  };
  const currPosition = { x: anchorPosition.x + changeInPosition.x, y: anchorPosition.y + changeInPosition.y };
  const xScale = Math.max(1 + (anchorPosition.x - currPosition.x) / (width * cellSize), 0);
  const yScale = Math.max(1 + (currPosition.y - anchorPosition.y) / (height * cellSize), 0);

  const currentGridX = currPosition.x / cellSize + 1;

  return dashboardConfiguration.map((widget) => {
    const isWidgetSelected = widgetIds.includes(widget.id);
    if (!isWidgetSelected) {
      // Only apply resize to selected widgets, so we do nothing.
      return widget;
    }
    // Apply scalar transformation to widget
    return {
      ...widget,
      x: currentGridX + (widget.x - x) * xScale,
      y: y + (widget.y - y) * yScale,
      width: widget.width * xScale,
      height: widget.height * yScale,
    };
  });
};

const resizeFromTopLeft = ({
  selectionBox: { x, y, width, height },
  dashboardConfiguration,
  widgetIds,
  changeInPosition,
  cellSize,
}: {
  selectionBox: Rect;
  dashboardConfiguration: DashboardConfiguration;
  changeInPosition: Position;
  widgetIds: string[];
  cellSize: number;
}): DashboardConfiguration => {
  const anchorPosition = {
    x: (x - 1) * cellSize,
    y: (y - 1) * cellSize,
  };
  const currPosition = { x: anchorPosition.x + changeInPosition.x, y: anchorPosition.y + changeInPosition.y };
  const xScale = Math.max(1 + (anchorPosition.x - currPosition.x) / (width * cellSize), 0);
  const yScale = Math.max(1 + (anchorPosition.y - currPosition.y) / (height * cellSize), 0);

  const currentGridX = currPosition.x / cellSize + 1;
  const currentGridY = currPosition.y / cellSize + 1;

  return dashboardConfiguration.map((widget) => {
    const isWidgetSelected = widgetIds.includes(widget.id);
    if (!isWidgetSelected) {
      // Only apply resize to selected widgets, so we do nothing.
      return widget;
    }
    // Apply scalar transformation to widget
    return {
      ...widget,
      x: currentGridX + (widget.x - x) * xScale,
      y: currentGridY + (widget.y - y) * yScale,
      width: widget.width * xScale,
      height: widget.height * yScale,
    };
  });
};

const resizeFromBottom = ({
  selectionBox: { y, height },
  dashboardConfiguration,
  widgetIds,
  changeInPosition,
  cellSize,
}: {
  selectionBox: Rect;
  dashboardConfiguration: DashboardConfiguration;
  changeInPosition: Position;
  widgetIds: string[];
  cellSize: number;
}): DashboardConfiguration => {
  const yScale = Math.max(1 + changeInPosition.y / (height * cellSize), 0);

  return dashboardConfiguration.map((widget) => {
    const isWidgetSelected = widgetIds.includes(widget.id);
    if (!isWidgetSelected) {
      // Only apply resize to selected widgets, so we do nothing.
      return widget;
    }
    // Apply scalar transformation to widget
    return {
      ...widget,
      y: y + (widget.y - y) * yScale,
      height: widget.height * yScale,
    };
  });
};
