import { Component, Prop, h } from '@stencil/core';
import { MinimalViewPortConfig } from '@synchro-charts/core';
import { AnyDataStreamQuery, DataModule, Request, RequestConfig } from '@iot-app-kit/core';

const DEFAULT_VIEWPORT = { duration: 10 * 1000 * 60 };

@Component({
  tag: 'iot-table',
  shadow: false,
})
export class IotTable {
  @Prop() appKit: DataModule;

  @Prop() query: AnyDataStreamQuery;

  @Prop() viewport: MinimalViewPortConfig = DEFAULT_VIEWPORT;

  @Prop() widgetId: string;

  @Prop() requestConfig: RequestConfig | undefined

  requestInfo(): Request {
    return {
      viewport: this.viewport,
      onlyFetchLatestValue: true,
      requestConfig: this.requestConfig,
    };
  }

  render() {
    const requestInfo = this.requestInfo();
    return (
      <iot-connector
        appKit={this.appKit}
        query={this.query}
        requestInfo={requestInfo}
        renderFunc={({ dataStreams }) => (
          <sc-table dataStreams={dataStreams} viewport={requestInfo.viewport} widgetId={this.widgetId} />
        )}
      />
    );
  }
}
