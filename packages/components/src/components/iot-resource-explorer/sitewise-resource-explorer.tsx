import { Component, h, Prop, State } from '@stencil/core';
import {
  AssetTreeSubscription,
  BranchReference,
  getSiteWiseAssetModule,
  SiteWiseAssetTreeModule,
  SiteWiseAssetTreeQuery,
  SiteWiseAssetTreeSession,
} from '@iot-app-kit/core';
import { SitewiseAssetResource } from './types';
import { EmptyStateProps, ITreeNode, UseTreeCollection } from '@iot-app-kit/related-table';
import { parseSitewiseAssetTree } from './utils';
import { TableProps } from '@awsui/components-react/table';
import { FilterTexts, ColumnDefinition } from './types';

@Component({
  tag: 'sitewise-resource-explorer',
})
export class SitewiseResourceExplorer {
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

  @State() selectItems: unknown[] = [];
  @State() items: SitewiseAssetResource[] = [];

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

  subscription: AssetTreeSubscription;

  componentWillLoad() {
    let session: SiteWiseAssetTreeSession = new SiteWiseAssetTreeModule(getSiteWiseAssetModule()).startSession(
      this.query
    );
    this.subscription = session.subscribe((newTree) => {
      this.items = parseSitewiseAssetTree(newTree);
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  expandNode = (node: ITreeNode<SitewiseAssetResource>) => {
    node.hierarchies?.forEach((hierarchy) => {
      this.subscription.expand(new BranchReference(node.id, hierarchy.id!));
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
    return (
      <iot-tree-table
        items={this.items}
        collectionOptions={collectionOptions}
        columnDefinitions={this.columnDefinitions}
        selectionType={this.selectionType || this.defaults.selectionType}
        loadingText={this.loadingText || this.defaults.loadingText}
        filterPlaceholder={filtering?.placeholder}
        onExpandChildren={this.expandNode}
        onSelectionChange={(event) => {
          this.selectItems = event.detail.selectedItems;
        }}
        empty={this.empty || this.defaults.empty}
        sortingDisabled={!this.sortingEnabled}
        wrapLines={this.wrapLines}
      ></iot-tree-table>
    );
  }
}
