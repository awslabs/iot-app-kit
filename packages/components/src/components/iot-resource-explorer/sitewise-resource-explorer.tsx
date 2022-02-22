import { Component, h, Prop, State } from '@stencil/core';
import {
  BranchReference,
  IoTAppKit,
  SiteWiseAssetTreeQuery,
  ErrorDetails,
  SiteWiseAssetTreeProvider,
  SiteWiseAssetTreeNode,
} from '@iot-app-kit/core';
import { SitewiseAssetResource, FilterTexts, ColumnDefinition } from './types';
import { EmptyStateProps, ITreeNode, UseTreeCollection } from '@iot-app-kit/related-table';
import { parseSitewiseAssetTree } from './utils';
import { TableProps } from '@awsui/components-react/table';
import { NonCancelableCustomEvent } from '@awsui/components-react';

@Component({
  tag: 'sitewise-resource-explorer',
})
export class SitewiseResourceExplorer {
  @Prop() appKit: IoTAppKit;
  @Prop() query: SiteWiseAssetTreeQuery;
  @Prop() columnDefinitions: ColumnDefinition<any>[];
  @Prop() filterTexts?: FilterTexts;
  @Prop() selectionType?: TableProps.SelectionType;
  @Prop() loadingText?: string;
  @Prop() empty?: EmptyStateProps;
  @Prop() filterEnabled: boolean;
  @Prop() sortingEnabled: boolean;
  @Prop() paginationEnabled: boolean;
  @Prop() wrapLines: boolean;
  @Prop() widgetId: string;
  @Prop() onSelectionChange: (event: NonCancelableCustomEvent<TableProps.SelectionChangeDetail<unknown>>) => void;

  @State() provider: SiteWiseAssetTreeProvider;
  @State() items: SitewiseAssetResource[] = [];

  @State() errors: ErrorDetails[] = [];

  defaults = {
    selectionType: 'single' as TableProps.SelectionType,
    loadingText: 'loading...',
    filterText: {
      placeholder: 'Filter by name',
      empty: 'No assets found.',
      noMatch: `We can't find a match.`,
    },
    empty: {
      header: 'No assets',
      description: `You don't have any asset.`,
    },
  };

  buildProvider() {
    return this.query.build(this.appKit.session(this.widgetId));
  }

  componentWillLoad() {
    this.provider = this.buildProvider();
    this.provider.subscribe({
      next: (data: SiteWiseAssetTreeNode[]) => {
        this.items = parseSitewiseAssetTree(data);
      },
      error: (err: ErrorDetails[]) => {
        this.errors = err;
      },
    });
  }

  componentWillUnmount() {
    this.provider.unsubscribe();
  }

  expandNode = (node: ITreeNode<SitewiseAssetResource>) => {
    node.hierarchies?.forEach((hierarchy) => {
      this.provider.expand(new BranchReference(node.id, hierarchy.id!));
    });
  };

  render() {
    const filtering = this.filterEnabled ? this.filterTexts || this.defaults.filterText : undefined;
    const collectionOptions: UseTreeCollection<unknown> = {
      columnDefinitions: this.columnDefinitions,
      keyPropertyName: 'id',
      parentKeyPropertyName: 'parentId',
      selection: {
        keepSelection: true,
      },
      sorting: {
        defaultState: {
          sortingColumn: {
            sortingField: 'name',
          },
          isDescending: true,
        },
      },
      filtering,
    };
    if (this.paginationEnabled) {
      collectionOptions.pagination = { pageSize: 20 };
    }

    let empty: EmptyStateProps = this.defaults.empty;

    if (this.empty) {
      empty = this.empty;
    }

    if (this.errors.length > 0) {
      // TODO: Make use of all the errors
      empty = { header: 'Error', description: this.errors[this.errors.length - 1]?.msg };
    }

    return (
      <iot-tree-table
        items={this.items}
        collectionOptions={collectionOptions}
        columnDefinitions={this.columnDefinitions}
        selectionType={this.selectionType || this.defaults.selectionType}
        loadingText={this.loadingText || this.defaults.loadingText}
        filterPlaceholder={filtering?.placeholder}
        onExpandChildren={this.expandNode}
        onSelectionChange={this.onSelectionChange}
        empty={empty}
        sortingDisabled={!this.sortingEnabled}
        wrapLines={this.wrapLines}
      ></iot-tree-table>
    );
  }
}
