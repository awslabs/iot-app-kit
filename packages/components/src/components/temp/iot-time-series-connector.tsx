import { Component, Prop, State } from '@stencil/core';
import { Provider, TimeSeriesDataCallback, TimeSeriesData } from '@iot-app-kit/core';

@Component({
  tag: 'iot-time-series-data-connector',
  shadow: false,
})
export class IotTimeSeriesDataConnector {
  @Prop() provider: Provider<TimeSeriesDataCallback>;

  @Prop() renderFunc: TimeSeriesDataCallback;

  @State() data: TimeSeriesData;

  componentDidLoad() {
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
