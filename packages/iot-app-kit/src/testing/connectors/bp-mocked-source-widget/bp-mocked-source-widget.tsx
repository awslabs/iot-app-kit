import { Component, Prop, h } from '@stencil/core';

import {
  Annotations,
  Axis,
  LegendConfig,
  Trend,
  DataStreamInfo,
  MinimalSizeConfig,
  MinimalViewPortConfig,
  TableColumn,
} from '@synchro-charts/core';
import { CredentialsOptions } from 'aws-sdk/lib/credentials';
import { createOnRequestData } from './onRequestData';

const request = createOnRequestData({ error: false });

/** Error message constants */
const INVALID_TAG_HEADER_MSG = 'Widget failed to load';
const INVALID_TAG_SUBHEADER_MSG = 'Please try again later or contact an admin for help.';

/**
 * An simple example of how to provide a solution to implementing a custom data source into
 * the components and dashboard.
 * Connectors act as the boundary between data sources and view models designed around
 * effective visualization.
 */
@Component({
  tag: 'bp-mocked-source-widget',
})
export class BpMockedSourceWidget {
  @Prop() widgetId!: string;
  @Prop() componentTag!: string;
  @Prop() isEditing!: boolean;
  @Prop() error: boolean = false;
  @Prop() annotations: Annotations;
  @Prop() trends: Trend[];
  @Prop() dataStreamInfo: DataStreamInfo[];
  @Prop() viewport: MinimalViewPortConfig;
  @Prop() size?: MinimalSizeConfig;
  @Prop() legend?: LegendConfig;
  @Prop() axis?: Axis.Options;
  @Prop() tableColumns!: TableColumn[];
  @Prop() mapName: string;
  @Prop() region: string;
  @Prop() credentials: CredentialsOptions;
  render() {
    return (
      <monitor-lazily-load
        renderFunc={() => (
          <monitor-dynamic-widget
            widgetId={this.widgetId}
            tableColumns={this.tableColumns}
            componentTag={this.componentTag}
            onRequestData={request}
            isEditing={this.isEditing}
            viewport={this.viewport}
            size={this.size}
            legend={this.legend}
            annotations={this.annotations}
            trends={this.trends}
            axis={this.axis}
            dataStreamInfo={this.dataStreamInfo}
            invalidTagErrorHeader={INVALID_TAG_HEADER_MSG}
            invalidTagErrorSubheader={INVALID_TAG_SUBHEADER_MSG}
            mapName={this.mapName}
            region={this.region}
            credentials={this.credentials}
          />
        )}
      />
    );
  }
}
