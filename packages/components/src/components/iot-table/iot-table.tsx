import { Component, Prop, h, State, Listen, Watch } from '@stencil/core';
import { TableColumn, Trend, Annotations as SynchroChartsAnnotations, getThresholds } from '@synchro-charts/core';
import {
  StyleSettingsMap,
  TimeSeriesDataRequestSettings,
  combineProviders,
  TimeQuery,
  TimeSeriesData,
  TimeSeriesDataRequest,
  ProviderWithViewport,
  viewportManager,
  Viewport,
  Annotations,
} from '@iot-app-kit/core';
import { v4 as uuidv4 } from 'uuid';
import {
  createTableItems,
  Item,
  TableProps,
  DefaultTableMessages,
  TableMessages,
  RecursivePartial,
} from '@iot-app-kit/table';
import merge from 'lodash/merge';

@Component({
  tag: 'iot-table',
  shadow: false,
})
export class IotTable {
  @Prop() annotations: Annotations;

  @Prop() messageOverrides?: RecursivePartial<TableMessages>;

  @Prop() trends: Trend[];

  @Prop() tableColumns: TableColumn[];

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

  /** Active Viewport */
  @State() activeViewport: Viewport;

  private unsubscribeFromViewportGroup: () => void | undefined;

  private messages: TableMessages;

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

  @Watch('messageOverrides')
  updateMessages(newMessageOverrides?: RecursivePartial<TableMessages>) {
    this.messages = merge(DefaultTableMessages, newMessageOverrides);
  }

  componentWillLoad() {
    this.buildProvider();
    this.updateMessages(this.messageOverrides);
    this.updateViewport(this.viewport);
    this.subscribeToViewportGroup();
  }

  disconnectedCallback() {
    if (this.unsubscribeFromViewportGroup) {
      this.unsubscribeFromViewportGroup();
    }
  }

  @Watch('queries')
  @Watch('settings')
  private onPropUpdate() {
    this.buildProvider();
  }

  @Watch('viewport')
  private onViewportUpdate() {
    this.provider.updateViewport(this.viewport);
    this.updateViewport(this.viewport);
  }

  @Listen('dateRangeChange')
  private handleDateRangeChange({ detail: [start, end] }: { detail: [Date, Date] }) {
    this.provider.updateViewport({ start, end });
  }

  updateViewport = (viewport: Viewport) => {
    // Update active viewport
    this.activeViewport = viewport;
  };

  subscribeToViewportGroup = () => {
    // TODO: Currently updating viewport's group will not work with Viewport Manager. Will add the support later.
    if (this.viewport.group != null) {
      const { viewport, unsubscribe } = viewportManager.subscribe(this.viewport.group, this.updateViewport);
      this.unsubscribeFromViewportGroup = unsubscribe;
      if (viewport) {
        this.updateViewport(viewport);
      } else {
        viewportManager.update(this.viewport.group, this.viewport);
      }
    }
  };

  render() {
    return (
      <iot-time-series-connector
        initialViewport={this.viewport}
        provider={this.provider}
        styleSettings={this.styleSettings}
        annotations={this.annotations}
        supportedDataTypes={['NUMBER', 'STRING', 'BOOLEAN']}
        renderFunc={({ dataStreams, annotations }) => {
          return (
            <iot-react-table
              columnDefinitions={this.columnDefinitions}
              items={createTableItems(
                {
                  dataStreams,
                  items: this.items,
                  viewport: this.activeViewport,
                  thresholds: getThresholds(annotations as SynchroChartsAnnotations),
                },
                this.messages
              )}
              sorting={this.sorting}
              propertyFiltering={this.propertyFiltering}
              messageOverrides={this.messages}
            />
          );
        }}
      />
    );
  }
}
