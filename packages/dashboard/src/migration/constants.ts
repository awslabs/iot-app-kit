export const defaultDisplaySettings = {
  numRows: 100,
  numColumns: 100,
  cellSize: 10,
  significantDigits: 4,
};
export const defaultResolution = '1m';
export const defaultAggregationType = 'AVERAGE';

/**
 * Default Monitor size is 3x3 squares
 * A similar sized application dashboard is 42x24 cells (if cellSize = 20)
 */
export const appCellsPerMonitorSquareWidth = 14; // 42 / 3
export const appCellPerMonitorSquareHeight = 8; // 24 / 3

export const minWidth = appCellsPerMonitorSquareWidth - 0.5;
export const minHeight = appCellPerMonitorSquareHeight - 0.5;

const defaultProperties = {
  aggregationType: defaultAggregationType,
};

export const barChartProperties = {
  ...defaultProperties,
  axis: {
    showY: true,
    showX: true,
  },
};

export const lineChartProperties = {
  ...defaultProperties,
  axis: {
    yVisible: true,
    xVisible: true,
  },
  symbol: {
    style: 'filled-circle',
  },
  line: {
    connectionStyle: 'linear',
    style: 'solid',
  },
  legend: {
    width: '30%',
    visibleContent: {
      unit: true,
      latestValue: true,
      minValue: false,
      asset: true,
      maxValue: false,
    },
    visible: true,
    position: 'right',
    height: '30%',
  },
};

export const scatterChartProperties = {
  ...defaultProperties,
  axis: {
    yVisible: true,
    xVisible: true,
  },
  symbol: {
    style: 'filled-circle',
  },
  line: {
    connectionStyle: 'none',
    style: 'solid',
  },
  legend: {
    visible: true,
  },
};

export const timelineProperties = {
  axis: {
    showY: true,
    showX: true,
  },
};
