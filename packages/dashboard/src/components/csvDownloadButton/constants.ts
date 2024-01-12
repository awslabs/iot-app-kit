const HOUR_IN_MS = 1000 * 60 * 60;
const DAY_IN_MS = HOUR_IN_MS * 24;
const FIFTEEN_MIN_IN_MS = 15 * 60 * 1000;

export const BAR_CHART_RESOLUTIONS = {
  [0]: '1m',
  [FIFTEEN_MIN_IN_MS]: '15m',
  [HOUR_IN_MS]: '1h',
  [DAY_IN_MS * 5]: '1d',
};

export const DEFAULT_VIEWPORT = { duration: '10m' };
export const EMPTY_DATA = [
  {
    timestamp: '',
    dataQuality: '',
    value: '',
    unit: '',
    aggregationType: '',
    resolution: '',
    propertyName: '',
    assetName: '',
    propertyAlias: '',
    assetId: '',
    dataType: '',
    dataTypeSpec: '',
    propertyId: '',
  },
];
