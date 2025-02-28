import type { Viewport } from '@iot-app-kit/core';

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
  CONTAINS: 'Contains',
};

export const DEFAULT_VIEWPORT: Viewport = { duration: '10m' };
