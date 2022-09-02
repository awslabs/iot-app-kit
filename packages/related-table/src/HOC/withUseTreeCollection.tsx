import React, { FC } from 'react';
import TextFilter from '@awsui/components-react/text-filter';
import Pagination from '@awsui/components-react/pagination';
import { NonCancelableCustomEvent, TableProps } from '@awsui/components-react';
import { EmptyState, EmptyStateProps } from '../RelatedTable/EmptyState';
import { RelatedTableProps } from '../RelatedTable/RelatedTable';
import { useTreeCollection, UseTreeCollection } from '../Hooks/useTreeCollection';
import { ITreeNode } from '../Model/TreeNode';

export interface RelatedTableExtendedProps<T> extends Omit<RelatedTableProps<T>, 'empty'> {
  items: T[];
  empty: EmptyStateProps;
  collectionOptions: UseTreeCollection<T>;
  filterPlaceholder?: string;
  expanded?: boolean;
}

export const withUseTreeCollection = (RelatedTableComp: FC<any>) => {
  return (wrapperProps: RelatedTableExtendedProps<any>) => {
    const {
      items,
      empty,
      columnDefinitions,
      collectionOptions,
      expandChildren,
      filterPlaceholder,
      onSortingChange,
      onSelectionChange,
      expanded,
    } = wrapperProps;
    const {
      expandNode,
      items: tree,
      collectionProps,
      filterProps,
      paginationProps,
    } = useTreeCollection(
      items,
      {
        ...collectionOptions,
        columnDefinitions,
      },
      expanded
    );

    const emptyComponent = React.createElement(EmptyState, empty);
    const filterComponent = React.createElement(TextFilter, {
      ...filterProps,
      filteringPlaceholder: filterPlaceholder || '',
    });
    const paginationComponent = React.createElement(Pagination, paginationProps);

    const hocProps = {
      ...wrapperProps,
      ...collectionProps,
      ...filterProps,
      ...paginationProps,
      columnDefinitions,
      items: tree,
      empty: emptyComponent,
      filter: filterPlaceholder ? filterComponent : null,
      pagination: collectionOptions.pagination ? paginationComponent : null,
      expandChildren: (node: ITreeNode<unknown>) => {
        expandNode(node);
        expandChildren(node);
      },
      onSortingChange: (event: NonCancelableCustomEvent<TableProps.SortingState<unknown>>) => {
        if (onSortingChange) {
          onSortingChange(event);
        }
        if (collectionProps.onSortingChange) {
          collectionProps.onSortingChange(event);
        }
      },
      onSelectionChange: (event: NonCancelableCustomEvent<TableProps.SelectionChangeDetail<unknown>>) => {
        if (onSelectionChange) {
          onSelectionChange(event);
        }
        if (collectionProps.onSelectionChange) {
          collectionProps.onSelectionChange(event);
        }
      },
    };
    return <RelatedTableComp {...hocProps} />;
  };
};
