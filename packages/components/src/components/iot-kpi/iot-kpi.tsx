import { Component, Prop, h } from '@stencil/core';
import { MinimalViewPortConfig } from '@synchro-charts/core';
import { AnyDataStreamQuery, DataModule, RequestConfig } from '@iot-app-kit/core';

const DEFAULT_VIEWPORT = { duration: 10 * 1000 };

@Component({
  tag: 'iot-kpi',
  shadow: false,
})
export class IotKpi {
  @Prop() appKit: DataModule;

  @Prop() query: AnyDataStreamQuery;

  @Prop() viewport: MinimalViewPortConfig = DEFAULT_VIEWPORT;

  @Prop() widgetId: string;

  @Prop() isEditing: boolean | undefined;

  @Prop() requestConfig: RequestConfig | undefined

  requestInfo() {
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
          <sc-kpi
            dataStreams={dataStreams}
            viewport={requestInfo.viewport}
            isEditing={this.isEditing}
            widgetId={this.widgetId}
          />
        )}
      />
    );
  }
}
