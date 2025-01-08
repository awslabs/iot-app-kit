import { type TableProps as CloudscapeTableProps } from '@cloudscape-design/components';
import type { Primitive } from '@iot-app-kit/helpers';
import type { DataPoint, ErrorDetails, Threshold } from '@iot-app-kit/core';
import type { UseCollectionOptions } from '@cloudscape-design/collection-hooks';
import type { TableMessages } from './messages';
import type { AssistantProperty } from '../../common/assistantProps';
import { type PascalCaseStateName } from '../../hooks/useAlarms/transformers';

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

export type AlarmItem = {
  id?: string;
  assetId?: string;
  alarmName?: string;
  property?: string;
  value?: Primitive;
  unit?: string;
  alarmExpression?: string;
  state?: PascalCaseStateName;
  severity?: number;
  isLoading?: boolean;
  threshold?: Threshold;
  /**
   * I don't know why these are
   * required but I need to leave
   * them because of the CellItem
   * type
   */
  valueOf?: () => Primitive | undefined;
  toString?: () => string;
};

export type CellItem = {
  value?: Primitive;
  error?: ErrorDetails;
  isLoading?: boolean;
  threshold?: Threshold;
  valueOf?: () => Primitive | undefined;
  toString?: () => string;
  quality?: DataPoint['quality'];
  refId?: string;
} & AlarmItem;

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
  refId?: string;
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
