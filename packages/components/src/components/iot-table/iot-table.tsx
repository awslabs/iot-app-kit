import { Component, Prop, h } from '@stencil/core';
import { MinimalViewPortConfig } from '@synchro-charts/core';
import { AnyDataStreamQuery, Request } from '@iot-app-kit/core';

const DEFAULT_VIEWPORT = { duration: 10 * 1000 * 60 };

@Component({
  tag: 'iot-table',
  shadow: false,
})
export class IotTable {
  @Prop() query: AnyDataStreamQuery;

  @Prop() viewport: MinimalViewPortConfig = DEFAULT_VIEWPORT;

  @Prop() widgetId: string;

  requestInfo(): Request {
    return {
      viewport: this.viewport,
      onlyFetchLatestValue: true,
    };
  }

  render() {
    const requestInfo = this.requestInfo();
    return (
      <iot-connector
        query={this.query}
        requestInfo={requestInfo}
        renderFunc={({ dataStreams }) => (
          <sc-table dataStreams={dataStreams} viewport={requestInfo.viewport} widgetId={this.widgetId} />
        )}
      />
    );
  }
}
