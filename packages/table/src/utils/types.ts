import { Annotations, Primitive, Threshold } from '@synchro-charts/core';
import { ErrorDetails } from '@iot-app-kit/core';
import { TableProps as AWSUITableProps } from '@awsui/components-react';
import { UseCollectionOptions } from '@awsui/collection-hooks/dist/cjs/interfaces';

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

export type TableItem = { [k: string]: CellItem };

export interface ColumnDefinition<T = unknown> extends Omit<AWSUITableProps.ColumnDefinition<T>, 'cell'> {
  formatter?: (data: Primitive) => React.ReactNode;
  key: string;
}

export interface TableProps<T = unknown> extends Omit<AWSUITableProps<T>, 'columnDefinitions'> {
  useCollectionOption?: UseCollectionOptions<T>;
  annotations?: Annotations;
  columnDefinitions: ColumnDefinition<T>[];
}
