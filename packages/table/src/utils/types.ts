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

export class CellItem {
  value?: Primitive;

  error?: ErrorDetails;

  isLoading?: boolean;

  threshold?: Threshold;

  valueOf: () => Primitive | undefined;

  constructor(props?: CellItemProps) {
    const { value, error, isLoading, threshold } = props || {};
    this.value = value;
    this.error = error;
    this.isLoading = isLoading;
    this.threshold = threshold;
    this.valueOf = () => {
      if (error) {
        return error.msg;
      }
      if (isLoading) {
        return 'Loading';
      }
      return value;
    };
  }
}

export type TableItem = { [k in string]: CellItem };
