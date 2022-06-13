import { Primitive, Threshold } from '@synchro-charts/core';
import { ErrorDetails } from '@iot-app-kit/core';
import { CellItem } from './types';

type CellProps = {
  value?: Primitive;
  error?: ErrorDetails;
  isLoading?: boolean;
  threshold?: Threshold;
};
export const createCellItem: (props?: CellProps) => CellItem = ({ value, error, isLoading, threshold } = {}) => {
  const valueOf = () => {
    if (error) {
      return error.msg;
    }
    if (isLoading) {
      return 'Loading';
    }
    return value;
  };

  const toString = () => {
    return `${valueOf()}`;
  };

  return {
    value,
    error,
    isLoading,
    threshold,
    valueOf,
    toString,
  };
};
