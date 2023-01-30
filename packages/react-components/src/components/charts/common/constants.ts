// NOTE: `enum`s are held separately from the types which are exported
// as part of the package, since `enum`'s cannot be present in a type declaration file.
// THis is due to an `enum` being a type plus an implementation, while type declaration
// files can only contain typing information.

/**
 * Maps the view model to d3 axis types. In the future we could add additional
 * custom scale types beyond what's available in `d3-axis`.
 */
export enum ScaleType {
  TimeSeries = 'time-series',
  Log = 'log',
  Linear = 'linear',
}

export enum LEGEND_POSITION {
  RIGHT = 'RIGHT',
  BOTTOM = 'BOTTOM',
}

export enum COMPARISON_OPERATOR {
  LESS_THAN = 'LT',
  GREATER_THAN = 'GT',
  LESS_THAN_EQUAL = 'LTE',
  GREATER_THAN_EQUAL = 'GTE',
  EQUAL = 'EQ',
  CONTAINS = 'CONTAINS',
}

export const COMPARATOR_MAP = {
  GTE: '>=',
  GT: '>',
  LTE: '<=',
  LT: '<',
  EQ: '=',
  CONTAINS: 'contains',
};

export enum StatusIcon {
  ERROR = 'error',
  ACTIVE = 'active',
  NORMAL = 'normal',
  ACKNOWLEDGED = 'acknowledged',
  SNOOZED = 'snoozed',
  DISABLED = 'disabled',
  LATCHED = 'latched',
}

export const STATUS_ICONS = [
  StatusIcon.ERROR,
  StatusIcon.ACTIVE,
  StatusIcon.NORMAL,
  StatusIcon.ACKNOWLEDGED,
  StatusIcon.SNOOZED,
  StatusIcon.DISABLED,
  StatusIcon.LATCHED,
];

export enum DATA_ALIGNMENT {
  EITHER = 'EITHER',
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
}
