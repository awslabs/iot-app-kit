import { Component, Host, h, Element, Prop } from '@stencil/core';
import ReactDOM from 'react-dom';
import React from 'react';
import {
  EmptyStateProps,
  RelatedTable,
  RelatedTableExtendedProps,
  withUseTreeCollection,
  UseTreeCollection,
} from '@iot-app-kit/related-table';
import { TableProps } from '@awsui/components-react/table';
import { NonCancelableCustomEvent, TextFilterProps } from '@awsui/components-react';

@Component({
  tag: 'iot-tree-table',
})
export class IotTreeTable {
  @Element() host: HTMLElement;

  @Prop() items!: unknown[];
  @Prop() columnDefinitions!: TableProps.ColumnDefinition<unknown>[];
  @Prop() collectionOptions!: UseTreeCollection<unknown>;

  @Prop() loading: boolean;
  @Prop() loadingText: string;

  @Prop() empty: EmptyStateProps;
  @Prop() filter: TextFilterProps;

  @Prop() selectedItems: unknown[];
  @Prop() selectionType: TableProps.SelectionType;

  @Prop() isItemDisabled: (item: unknown) => boolean;
  @Prop() wrapLines: boolean;
  @Prop() resizableColumns: boolean;
  @Prop() sortingColumn: TableProps.SortingColumn<unknown>;
  @Prop() sortingDescending: boolean;
  @Prop() sortingDisabled: boolean;
  @Prop() ariaLabels: TableProps.AriaLabels<unknown>;

  @Prop() onSelectionChange: (event: NonCancelableCustomEvent<TableProps.SelectionChangeDetail<unknown>>) => void;
  @Prop() onExpandChildren: (node: unknown) => void;
  @Prop() onSortingChange: (event: NonCancelableCustomEvent<TableProps.SortingState<unknown>>) => void;

  componentDidLoad() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    const properties: RelatedTableExtendedProps<unknown> = {
      items: this.items,
      collectionOptions: this.collectionOptions,
      columnDefinitions: this.columnDefinitions,

      empty: this.empty,
      filter: this.filter,

      loading: this.loading,
      loadingText: this.loadingText,

      selectionType: this.selectionType,
      selectedItems: this.selectedItems,
      isItemDisabled: this.isItemDisabled,
      wrapLines: this.wrapLines,
      resizableColumns: this.resizableColumns,
      sortingColumn: this.sortingColumn,
      sortingDescending: this.sortingDescending,
      ariaLabels: this.ariaLabels,

      expandChildren: this.onExpandChildren,
      onSelectionChange: this.onSelectionChange,
      onSortingChange: this.onSortingChange,
    };
    ReactDOM.render(React.createElement(withUseTreeCollection(RelatedTable), properties), this.host);
  }

  render() {
    return <Host />;
  }
}
