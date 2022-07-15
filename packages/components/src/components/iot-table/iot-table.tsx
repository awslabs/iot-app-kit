import { Component, Listen, Prop, State, Watch, h } from '@stencil/core';
import { Annotations, getThresholds } from '@synchro-charts/core';
import {
  combineProviders,
  ProviderWithViewport,
  StyleSettingsMap,
  TimeQuery,
  TimeSeriesData,
  TimeSeriesDataRequest,
  TimeSeriesDataRequestSettings,
  Viewport,
} from '@iot-app-kit/core';
import { v4 as uuidv4 } from 'uuid';
import { createTableItems, Item, TableProps } from '@iot-app-kit/table';

@Component({
  tag: 'iot-table',
  shadow: false,
})
export class IotTable {
  @Prop() annotations: Annotations;

  @Prop() queries!: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];

  @Prop() viewport!: Viewport;

  @Prop() settings: TimeSeriesDataRequestSettings = {};

  @Prop() widgetId: string = uuidv4();

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @Prop() items!: Item[];

  @Prop() columnDefinitions!: TableProps['columnDefinitions'];

  @Prop() sorting: TableProps['sorting'];

  @Prop() propertyFiltering: TableProps['propertyFiltering'];

  @State() provider: ProviderWithViewport<TimeSeriesData[]>;

  private defaultSettings: TimeSeriesDataRequestSettings = {
    resolution: '0',
    fetchMostRecentBeforeEnd: true,
  };

  buildProvider() {
    this.provider = combineProviders(
      this.queries.map((query) =>
        query.build(this.widgetId, {
          viewport: this.viewport,
          settings: {
            ...this.defaultSettings,
            ...this.settings,
          },
        })
      )
    );
  }

  componentWillLoad() {
    this.buildProvider();
  }

  @Watch('queries')
  @Watch('settings')
  @Watch('viewport')
  private onPropUpdate() {
    this.provider.unsubscribe();
    this.buildProvider();
  }

  @Listen('dateRangeChange')
  private handleDateRangeChange({ detail: [start, end, lastUpdatedBy] }: { detail: [Date, Date, string | undefined] }) {
    this.provider.updateViewport({ start, end, lastUpdatedBy });
  }

  render() {
    return (
      <iot-time-series-connector
        provider={this.provider}
        styleSettings={this.styleSettings}
        renderFunc={({ dataStreams }) => {
          return (
            <iot-react-table
              columnDefinitions={this.columnDefinitions}
              items={createTableItems({
                dataStreams,
                items: this.items,
                viewport: this.viewport,
                thresholds: getThresholds(this.annotations),
              })}
              sorting={this.sorting}
              propertyFiltering={this.propertyFiltering}
            />
          );
        }}
      />
    );
  }
}
