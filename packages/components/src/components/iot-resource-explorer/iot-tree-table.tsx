import { Component, Host, h, Element, Prop, State } from '@stencil/core';
import { createRoot, type Root } from 'react-dom/client';
import {
  type EmptyStateProps,
  RelatedTable,
  type RelatedTableExtendedProps,
  withUseTreeCollection,
  type UseTreeCollection,
  type ITreeNode,
} from '@iot-app-kit/related-table';
import { type TableProps } from '@awsui/components-react/table';
import { type NonCancelableCustomEvent } from '@awsui/components-react';
import { createElement } from 'react';

const RelatedTableWithCollectionHooks = withUseTreeCollection(RelatedTable);

@Component({
  tag: 'iot-tree-table',
})
export class IotTreeTable {
  @Element() host: HTMLElement;
  @State() selectedItems: unknown[] = [];

  @Prop() items!: unknown[];
  @Prop() columnDefinitions!: TableProps.ColumnDefinition<any>[];
  @Prop() collectionOptions!: UseTreeCollection<unknown>;
  @Prop() expanded: boolean;

  @Prop() loading: boolean;
  @Prop() loadingText: string;
  @Prop() filterPlaceholder: string;

  @Prop() selectionType: TableProps.SelectionType;
  @Prop() empty: EmptyStateProps;

  @Prop() isItemDisabled: (item: unknown) => boolean;
  @Prop() wrapLines: boolean;
  @Prop() resizableColumns: boolean;
  @Prop() sortingDisabled: boolean;
  @Prop() ariaLabels: TableProps.AriaLabels<unknown>;

  @Prop() onSelectionChange: (
    event: NonCancelableCustomEvent<TableProps.SelectionChangeDetail<unknown>>
  ) => void;
  @Prop() onExpandChildren: (node: ITreeNode<any>) => void;
  @Prop() onSortingChange: (
    event: NonCancelableCustomEvent<TableProps.SortingState<unknown>>
  ) => void;
  private root: Root;

  componentDidLoad() {
    this.root = createRoot(this.host);
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    const attributes = {
      items: this.items,
      columnDefinitions: this.columnDefinitions,
      collectionOptions: this.collectionOptions,
      expanded: this.expanded,

      loading: this.loading,
      loadingText: this.loadingText,
      filterPlaceholder: this.filterPlaceholder,

      selectionType: this.selectionType,
      selectedItems: this.selectedItems,

      empty: this.empty,
      isItemDisabled: this.isItemDisabled,
      wrapLines: this.wrapLines,
      resizableColumns: this.resizableColumns,
      sortingDisabled: this.sortingDisabled,
      ariaLabels: this.ariaLabels,

      expandChildren: this.onExpandChildren,
      onSortingChange: this.onSortingChange,
      onSelectionChange: (
        event: NonCancelableCustomEvent<
          TableProps.SelectionChangeDetail<unknown>
        >
      ) => {
        this.selectedItems = event.detail.selectedItems;
        if (this.onSelectionChange) {
          this.onSelectionChange(event);
        }
      },
    } as unknown as RelatedTableExtendedProps<unknown>;

    this.root.render(
      createElement(RelatedTableWithCollectionHooks, attributes)
    );
  }

  render() {
    return <Host />;
  }
}
