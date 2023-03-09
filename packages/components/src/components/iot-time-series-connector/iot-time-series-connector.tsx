import { Component, Prop, State, Watch } from '@stencil/core';
import { Annotations, Provider, StyleSettingsMap, TimeSeriesData, DataType, Viewport } from '@iot-app-kit/core';
import { bindStylesToDataStreams } from '../common/bindStylesToDataStreams';
import { combineAnnotations } from '../common/combineAnnotations';

const combineTimeSeriesData = (timeSeresDataResults: TimeSeriesData[]): TimeSeriesData =>
  timeSeresDataResults.reduce(
    (timeSeriesData, newTimeSeriesData) => {
      const { dataStreams, viewport, annotations } = newTimeSeriesData;

      const combinedAnnotations = combineAnnotations(timeSeriesData.annotations, annotations);

      return {
        dataStreams: [...timeSeriesData.dataStreams, ...dataStreams],
        viewport,
        annotations: combinedAnnotations,
      };
    },
    { dataStreams: [], viewport: { duration: 0 }, annotations: {} }
  );

@Component({
  tag: 'iot-time-series-connector',
  shadow: false,
})
export class IotTimeSeriesConnector {
  @Prop() initialViewport: Viewport;

  @Prop() annotations: Annotations;

  @Prop() provider: Provider<TimeSeriesData[]>;

  @Prop() renderFunc: (data: TimeSeriesData) => void;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @Prop() assignDefaultColors: boolean | undefined;

  @Prop() supportedDataTypes: DataType[] = ['NUMBER', 'BOOLEAN', 'STRING'];

  @State() data: Omit<TimeSeriesData, 'viewport'> & { viewport?: Viewport } = {
    dataStreams: [],
    annotations: {},
  };

  componentWillLoad() {
    this.subscribeToProvider();
  }

  componentDidUnmount() {
    this.provider.unsubscribe();
  }

  @Watch('provider')
  private onProviderUpdate(_: Provider<TimeSeriesData[]>, oldProvider: Provider<TimeSeriesData[]>) {
    oldProvider.unsubscribe();
    this.subscribeToProvider();
  }

  subscribeToProvider() {
    this.provider.subscribe({
      next: (results: TimeSeriesData[]) => {
        this.data = combineTimeSeriesData(results);
      },
    });
  }

  render() {
    const { dataStreams, viewport, annotations } = this.data;
    const combinedAnnotations = combineAnnotations(this.annotations, annotations);

    const filteredDataStreams = bindStylesToDataStreams({
      dataStreams,
      styleSettings: this.styleSettings,
      assignDefaultColors: this.assignDefaultColors || false,
    }).filter((stream) => {
      if (stream.error || !stream.dataType) return false;
      if (stream.streamType === 'ALARM') return true;
      return this.supportedDataTypes.includes(stream.dataType);
    });

    return this.renderFunc({
      dataStreams: filteredDataStreams,
      viewport: viewport || this.initialViewport,
      annotations: combinedAnnotations,
    });
  }
}
