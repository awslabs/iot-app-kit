import Table, { TableProps } from '@awsui/components-react/table';
import React, { ReactNode } from 'react';
import { ITreeNode } from '../Model/TreeNode';
import { ButtonWithTreeLines } from './ButtonWithTreeLines';

export interface RelatedTableProps<T> extends TableProps<T> {
  expandChildren: (node: T) => void;
  expandColumnPosition?: number;
  filteringText?: string;
}

export function RelatedTable<T>(props: RelatedTableProps<ITreeNode<T>>) {
  const {
    columnDefinitions,
    items = [],
    expandChildren,
    expandColumnPosition = 1,
    filteringText = '',
  } = props;

  const isFiltering = filteringText !== '';
  const zeroBasedColumnPos = expandColumnPosition - 1;
  const columns = [...columnDefinitions];
  const columnToExpand = columns[zeroBasedColumnPos];
  columns[zeroBasedColumnPos] = {
    ...columnToExpand,
    cell: (node, ...rest) => {
      const cell = columnToExpand?.cell(node, ...rest);
      return (
        <ButtonWithTreeLines
          alwaysExpanded={isFiltering}
          node={node}
          content={cell as ReactNode}
          onClick={() => {
            expandChildren(node);
          }}
        />
      );
    },
  };
  return <Table {...props} columnDefinitions={columns} items={items} />;
}
