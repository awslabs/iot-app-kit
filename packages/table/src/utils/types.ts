import { Primitive, Threshold } from '@synchro-charts/core';
import { ErrorDetails } from '@iot-app-kit/core';

export type ItemRef = {
  $cellRef: {
    id: string;
    resolution: number;
  };
};

export type Item = {
  [key in string]: ItemRef | unknown;
};

export type CellItemProps = {
  value?: Primitive;
  error?: ErrorDetails;
  isLoading?: boolean;
  threshold?: Threshold;
};

export type CellItem = {
  value?: Primitive;
  error?: ErrorDetails;
  isLoading?: boolean;
  threshold?: Threshold;
  valueOf: () => Primitive | undefined;
  toString: () => string;
};

export type TableItem = { [k in string]: CellItem };
