import { Component, Prop, State, Watch } from '@stencil/core';
import { Provider, StyleSettingsMap, TimeSeriesData } from '@iot-app-kit/core';
import { MinimalViewPortConfig } from '@synchro-charts/core';
import { bindStylesToDataStreams } from '../common/bindStylesToDataStreams';

const DEFAULT_VIEWPORT = { duration: 10 * 1000 * 60 };

@Component({
  tag: 'iot-time-series-connector',
  shadow: false,
})
export class IotTimeSeriesConnector {
  @Prop() provider: Provider<TimeSeriesData>;

  @Prop() renderFunc: (data: TimeSeriesData) => void;

  @Prop() initialViewport: MinimalViewPortConfig;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @State() data: TimeSeriesData = {
    dataStreams: [],
    viewport: DEFAULT_VIEWPORT,
  };

  componentWillLoad() {
    this.provider.subscribe({
      next: (data: TimeSeriesData) => {
        this.data = data;
      },
    });
  }

  @Watch('provider')
  private onProviderUpdate() {
    this.provider.unsubscribe();

    this.provider.subscribe({
      next: (data: TimeSeriesData) => {
        this.data = data;
      },
    });
  }

  componentDidUnmount() {
    this.provider.unsubscribe();
  }

  render() {
    const { data } = this;
    const { dataStreams, viewport } = data;

    return this.renderFunc({
      dataStreams: bindStylesToDataStreams({ dataStreams, styleSettings: this.styleSettings }),
      viewport,
    });
  }
}
