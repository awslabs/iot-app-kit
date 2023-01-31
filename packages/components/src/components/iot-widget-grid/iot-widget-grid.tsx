import { Component, Prop, h, State, Listen, Watch } from '@stencil/core';
import { Annotations, DataStream, DataStream as SynchroChartsDataStream, LabelsConfig, MessageOverrides } from '@synchro-charts/core';
import {
  StyleSettingsMap,
  TimeSeriesDataRequestSettings,
  TimeQuery,
  TimeSeriesData,
  TimeSeriesDataRequest,
  Viewport,
  ProviderWithViewport,
  combineProviders,
} from '@iot-app-kit/core';
import { v4 as uuidv4 } from 'uuid';
import { RenderCell } from '@synchro-charts/core/dist/types/components/sc-widget-grid/types';

@Component({
  tag: 'iot-widget-grid',
  shadow: false,
})
export class IotWidgetGrid {
  @Prop() annotations: Annotations;

  @Prop() queries!: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];

  @Prop() viewport!: Viewport;

  @Prop() settings: TimeSeriesDataRequestSettings = {};

  @Prop() widgetId: string = uuidv4();

  @Prop() isEditing: boolean | undefined;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @State() provider: ProviderWithViewport<TimeSeriesData[]>;

  @Prop() labelsConfig: LabelsConfig;

  @Prop() renderCell: RenderCell;

  @Prop() dataStreams!: DataStream[];

  @Prop() messageOverrides: MessageOverrides = {};

  

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
    console.info('IOT WIDGET componentWillLoad')
    this.buildProvider();
  }

  @Watch('queries')
  @Watch('settings')
  @Watch('viewport')
  private onPropUpdate() {
    console.info('IOT WIDGET ONPROPUPDATE')
    this.provider.unsubscribe();
    this.buildProvider();
  }

  render() {
    console.info('IOT WIDGET RENDER')
    return (
      <sc-widget-grid
        labelsConfig={this.labelsConfig}
        viewport={this.viewport}
        widgetId={this.widgetId}
        dataStreams={this.dataStreams}
        annotations={this.annotations}
        isEditing={this.isEditing}
        messageOverrides={this.messageOverrides}
        renderCell={this.renderCell}
      />
    );
  }
}
