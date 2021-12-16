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
import { EmptyStateProps, ITreeNode } from '@iot-app-kit/related-table';
import { parseSitewiseAssetTree } from './utils';
import { TableProps } from '@awsui/components-react/table';
import { FilterTexts } from './types';

@Component({
  tag: 'sitewise-resource-explorer',
})
export class SitewiseResourceExplorer {
  @Prop() query: SiteWiseAssetTreeQuery;
  @Prop() filterTexts?: FilterTexts;
  @Prop() selectionType?: TableProps.SelectionType;
  @Prop() loadingText?: string;
  @Prop() empty?: EmptyStateProps;

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

  columnDefinitions = [
    {
      sortingField: 'name',
      id: 'name',
      header: 'Asset Name',
      cell: ({ name }: SitewiseAssetResource) => name,
    },
    {
      sortingField: 'status',
      id: 'status',
      header: 'Status',
      cell: ({ status }: SitewiseAssetResource) => status?.state,
    },
    {
      sortingField: 'creationDate',
      id: 'creationDate',
      header: 'Created',
      cell: ({ creationDate }: SitewiseAssetResource) => creationDate?.toUTCString(),
    },
    {
      sortingField: 'lastUpdateDate',
      id: 'lastUpdateDate',
      header: 'Updated',
      cell: ({ lastUpdateDate }: SitewiseAssetResource) => lastUpdateDate?.toUTCString(),
    },
  ];
  collectionOptions = {
    columnDefinitions: this.columnDefinitions,
    sorting: {
      defaultState: {
        sortingColumn: {
          sortingField: 'name',
        },
        isDescending: true,
      },
    },
    pagination: { pageSize: 20 },
    keyPropertyName: 'id',
    parentKeyPropertyName: 'parentId',
    selection: {
      keepSelection: true,
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
    return (
      <iot-tree-table
        items={this.items}
        collectionOptions={this.collectionOptions}
        columnDefinitions={this.columnDefinitions}
        selectionType={this.selectionType || this.defaults.selectionType}
        loadingText={this.loadingText || this.defaults.loadingText}
        filterTexts={this.filterTexts || this.defaults.filterText}
        onExpandChildren={this.expandNode}
        onSelectionChange={(event) => {
          this.selectItems = event.detail.selectedItems;
        }}
        empty={this.empty || this.defaults.empty}
      ></iot-tree-table>
    );
  }
}
