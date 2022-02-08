import { Component, Prop, State } from '@stencil/core';
import { Provider, TimeSeriesDataCallback, TimeSeriesData } from '@iot-app-kit/core';

@Component({
  tag: 'iot-time-series-connector',
  shadow: false,
})
export class IotTimeSeriesConnector {
  @Prop() provider: Provider<TimeSeriesDataCallback>;

  @Prop() renderFunc: TimeSeriesDataCallback;

  @State() data: TimeSeriesData;

  componentWillLoad() {
    this.provider.subscribe((data: TimeSeriesData) => {
      this.data = data;
    });
  }

  componentDidUnmount() {
    this.provider.unsubscribe();
  }

  render() {
    const { data } = this;

    return this.renderFunc(data);
  }
}
