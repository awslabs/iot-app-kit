import { TableProps as CloudscapeTableProps } from '@cloudscape-design/components';
import type {
  DataPoint,
  ErrorDetails,
  Primitive,
  Threshold,
} from '@iot-app-kit/core';
import type { UseCollectionOptions } from '@cloudscape-design/collection-hooks';
import type { TableMessages } from './messages';
import type { AssistantProperty } from '../../common/assistantProps';

export type TableItemRef = {
  $cellRef: {
    id: string;
    resolution: number;
  };
};

export type TableItem = {
  [key in string]: TableItemRef | Primitive | undefined;
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
  quality?: DataPoint['quality'];
};

export type TableItemHydrated = { [k: string]: CellItem };

export interface TableColumnDefinition
  extends Omit<
    CloudscapeTableProps.ColumnDefinition<TableItemHydrated>,
    'cell'
  > {
  formatter?: (data: Primitive) => Primitive;
  key: string;
}

export type CellProps = {
  value: Primitive;
  error: ErrorDetails;
  isLoading: boolean;
  threshold: Threshold;
  quality?: DataPoint['quality'];
};

export interface TableProps
  extends Omit<CloudscapeTableProps<TableItemHydrated>, 'columnDefinitions'> {
  columnDefinitions: TableColumnDefinition[];
  sorting?: UseCollectionOptions<TableItemHydrated>['sorting'];
  propertyFiltering?: UseCollectionOptions<TableItemHydrated>['propertyFiltering'];
  messageOverrides: TableMessages;
  precision?: number;
  pageSize?: number;
  paginationEnabled?: boolean;
  assistant?: AssistantProperty;
  onTableSelection?: (indexesSelected: number[]) => void;
}
