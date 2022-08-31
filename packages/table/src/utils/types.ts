import { Primitive, Threshold } from '@synchro-charts/core';
import { ErrorDetails } from '@iot-app-kit/core';
import { TableProps as CSTableProps } from '@cloudscape-design/components';
import { UseCollectionOptions } from '@cloudscape-design/collection-hooks';
import { TableMessages } from './messages';

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

export interface ColumnDefinition extends Omit<CSTableProps.ColumnDefinition<TableItem>, 'cell'> {
  formatter?: (data: Primitive) => Primitive;
  key: string;
}

export type CellProps = {
  value: Primitive;
  error: ErrorDetails;
  isLoading: boolean;
  threshold: Threshold;
};

export interface TableProps extends Omit<CSTableProps<TableItem>, 'columnDefinitions'> {
  columnDefinitions: ColumnDefinition[];
  sorting?: UseCollectionOptions<TableItem>['sorting'];
  propertyFiltering?: UseCollectionOptions<TableItem>['propertyFiltering'];
  messageOverrides: TableMessages;
}

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};
