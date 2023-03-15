import type { TableItem, TableItemRef } from './types';

export function isTableItemRef(value: TableItem[string]): value is TableItemRef {
  return typeof value === 'object' && value?.$cellRef !== undefined;
}
