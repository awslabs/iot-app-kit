import { TableProps } from '@awsui/components-react/table';
import { ITreeNode } from '../Model/TreeNode';

const defaultComparator = <T>(sortingField: keyof T) => {
  return (row1: T, row2: T) => {
    // Use empty string as a default value, because it works well to compare with both strings and numbers:
    // Every number can be casted to a string, but not every string can be casted to a meaningful number,
    // sometimes it is NaN.
    const value1 = row1[sortingField] ?? '';
    const value2 = row2[sortingField] ?? '';
    if (typeof value1 === 'string' && typeof value2 === 'string') {
      return value1.localeCompare(value2);
    }
    if (value1 < value2) {
      return -1;
    }
    // use loose comparison to handle inconsistent data types like undefined, null
    // eslint-disable-next-line eqeqeq
    return value1 == value2 ? 0 : 1;
  };
};

export const sortTree = <T>(
  tree: ITreeNode<T>[],
  sortState: TableProps.SortingState<T>,
  columnsDefinitions: ReadonlyArray<TableProps.ColumnDefinition<T>>
) => {
  const { sortingColumn } = sortState;
  if (sortingColumn && sortingColumn.sortingField) {
    const columnDefinition = columnsDefinitions.find((column) => column.sortingField === sortingColumn.sortingField);
    const direction = sortState.isDescending ? -1 : 1;
    const comparator =
      columnDefinition?.sortingComparator || defaultComparator(sortState.sortingColumn.sortingField as keyof T);

    tree
      .sort((a: T, b: T) => comparator(a, b) * direction)
      .forEach((node) => sortTree(node.getChildren(), sortState, columnsDefinitions));
  }
};
