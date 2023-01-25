import { Component, Prop, State, Watch } from '@stencil/core';
import { Provider, StyleSettingsMap, TimeSeriesData, DataType } from '@iot-app-kit/core';
import { bindStylesToDataStreams } from '../common/bindStylesToDataStreams';
import { combineAnnotations } from '../common/combineAnnotations';
import { Annotations } from '@synchro-charts/core';

const DEFAULT_VIEWPORT = { duration: 10 * 1000 * 60 }; // ten minutes

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
  @Prop() annotations: Annotations;

  @Prop() provider: Provider<TimeSeriesData[]>;

  @Prop() renderFunc: (data: TimeSeriesData) => void;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @Prop() assignDefaultColors: boolean | undefined;

  @Prop() supportedDataTypes: DataType[] = ['NUMBER', 'BOOLEAN', 'STRING'];

  @State() data: TimeSeriesData = {
    dataStreams: [],
    viewport: DEFAULT_VIEWPORT,
    annotations: {},
  };

  componentWillLoad() {
    this.provider.subscribe({
      next: (results: TimeSeriesData[]) => {
        this.data = combineTimeSeriesData(results);
      },
    });
  }

  @Watch('provider')
  private onProviderUpdate() {
    this.provider.unsubscribe();

    this.provider.subscribe({
      next: (results: TimeSeriesData[]) => {
        this.data = combineTimeSeriesData(results);
      },
    });
  }

  componentDidUnmount() {
    this.provider.unsubscribe();
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
      viewport,
      annotations: combinedAnnotations,
    });
  }
}
