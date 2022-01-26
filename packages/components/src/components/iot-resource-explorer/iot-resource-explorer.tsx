import { Component, h, Prop } from '@stencil/core';
import { IoTAppKitSession } from '@iot-app-kit/core';
import { ColumnDefinition, SitewiseAssetResource } from './types';
import { EmptyStateProps } from '@iot-app-kit/related-table';
import { isSiteWiseQuery } from './utils';
import { TableProps } from '@awsui/components-react/table';
import { ResourceExplorerQuery, FilterTexts } from './types';
import { NonCancelableCustomEvent } from '@awsui/components-react';

@Component({
  tag: 'iot-resource-explorer',
})
export class IotResourceExplorer {
  @Prop() appKitSession: IoTAppKitSession;
  @Prop() query: ResourceExplorerQuery;
  @Prop() columnDefinitions?: ColumnDefinition<SitewiseAssetResource>[];
  @Prop() filterTexts?: FilterTexts;
  @Prop() selectionType?: TableProps.SelectionType;
  @Prop() loadingText?: string;
  @Prop() empty?: EmptyStateProps;
  @Prop() filterEnabled: boolean = true;
  @Prop() sortingEnabled: boolean = true;
  @Prop() paginationEnabled: boolean = true;
  @Prop() wrapLines: boolean = false;

  @Prop() onSelectionChange: (event: NonCancelableCustomEvent<TableProps.SelectionChangeDetail<unknown>>) => void;

  siteWiseColumnDefinitions: ColumnDefinition<SitewiseAssetResource>[] = [
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

  render() {
    if (isSiteWiseQuery(this.query)) {
      return (
        <sitewise-resource-explorer
          appKitSession={this.appKitSession}
          query={this.query}
          columnDefinitions={this.columnDefinitions || this.siteWiseColumnDefinitions}
          filterTexts={this.filterTexts}
          loadingText={this.loadingText}
          empty={this.empty}
          selectionType={this.selectionType}
          filterEnabled={this.filterEnabled}
          sortingEnabled={this.sortingEnabled}
          paginationEnabled={this.paginationEnabled}
          wrapLines={this.wrapLines}
          onSelectionChange={this.onSelectionChange}
        ></sitewise-resource-explorer>
      );
    }

    return null;
  }
}
