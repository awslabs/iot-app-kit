import type { CellItem, CellProps } from './types';
import type { TableMessages } from './messages';

export const createCellItem: (
  props: Partial<CellProps>,
  messageOverrides: TableMessages
) => CellItem = (
  { value, error, isLoading, threshold, quality, refId } = {},
  messageOverrides
) => {
  const valueOf = () => {
    if (error) {
      return error.msg;
    }
    if (isLoading) {
      return messageOverrides.tableCell.loading;
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
    quality,
    refId,
  };
};
