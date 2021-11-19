import * as React from 'react';
import { useEffect, useState } from 'react';
import TextFilter from '@awsui/components-react/text-filter';
import Pagination from '@awsui/components-react/pagination';
import { TableProps, TextFilterProps } from '@awsui/components-react';
import EmptyState, { EmptyStateProps } from '../RelatedTable/EmptyState';
import SortingState = TableProps.SortingState;
import { RelatedTableProps } from '../RelatedTable/RelatedTable';
import { useTreeCollection, UseTreeCollection } from '../Hooks/useTreeCollection';
import { ITreeNode } from '../Model/TreeNode';

export interface RelatedTableActions<T> {
  setFiltering(filteringText: string): void;
  setCurrentPage(pageNumber: number): void;
  setSorting(state: SortingState<T>): void;
  setSelectedItems(selectedItems: ReadonlyArray<T>): void;
  reset(): void;
}

export interface RelatedTableExtendedProps<T> extends RelatedTableProps<T> {
  items: T[];
  collectionOptions: UseTreeCollection<T>;
  expandChildren: (node: T) => void;
  empty: EmptyStateProps;
  filter?: TextFilterProps;
  onReady?: (actions: RelatedTableActions<T>) => void;
}

export const withUseTreeCollection = (RelatedTableComp: React.FC<any>) => {
  return React.forwardRef(<T extends unknown>(props: RelatedTableExtendedProps<T>, ref: any) => {
    const [isReady, setReady] = useState<boolean>(false);
    const {
      items,
      columnDefinitions,
      collectionOptions,
      expandChildren,
      empty,
      filter,
      selectedItems,
      onSortingChange,
      onSelectionChange,
      onReady,
    } = props;

    const {
      items: nodes,
      collectionProps,
      filterProps,
      paginationProps,
      expandNode,
      actions,
      reset,
    } = useTreeCollection(items, {
      ...collectionOptions,
      columnDefinitions,
    });

    const renderEmpty = () => {
      if (empty) {
        return <EmptyState {...empty} />;
      }
      return null;
    };

    const renderFilter = () => {
      if (filter) {
        return <TextFilter {...filter} {...filterProps} />;
      }
      return null;
    };

    const renderPagination = () => {
      if (collectionOptions.pagination) {
        return <Pagination {...collectionOptions.pagination} {...paginationProps} />;
      }
      return null;
    };

    useEffect(() => {
      if (onReady && !isReady) {
        onReady({
          ...actions,
          reset,
        });
        setReady(true);
      }
    }, [actions, onReady, reset, isReady]);

    return (
      <RelatedTableComp
        {...props}
        {...filterProps}
        {...collectionProps}
        items={nodes || []}
        columnDefinitions={columnDefinitions}
        trackBy={collectionOptions.keyPropertyName}
        expandChildren={(node: ITreeNode<T>) => {
          expandNode(node);
          expandChildren(node);
        }}
        empty={renderEmpty()}
        selectedItems={selectedItems}
        onSelectionChange={onSelectionChange}
        onSortingChange={(event: CustomEvent<TableProps.SortingState<T>>) => {
          if (onSortingChange) {
            onSortingChange(event);
          }
          if (collectionProps.onSortingChange) {
            collectionProps.onSortingChange(event);
          }
        }}
        filter={renderFilter()}
        pagination={renderPagination()}
        ref={ref}
      />
    );
  });
};
