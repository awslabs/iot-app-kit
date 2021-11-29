import { Component, Prop, h } from '@stencil/core';
import { MinimalViewPortConfig } from '@synchro-charts/core';
import { AnyDataStreamQuery, DataModule, Request } from '@iot-app-kit/core';

const DEFAULT_VIEWPORT = { duration: 10 * 1000 * 60 };

@Component({
  tag: 'iot-status-timeline',
  shadow: false,
})
export class IotStatusTimeline {
  @Prop() appKit: DataModule;

  @Prop() query: AnyDataStreamQuery;

  @Prop() viewport: MinimalViewPortConfig = DEFAULT_VIEWPORT;

  @Prop() widgetId: string;

  @Prop() isEditing: boolean | undefined;

  requestInfo(): Request {
    return {
      viewport: this.viewport,
      onlyFetchLatestValue: false,
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
          <sc-status-timeline
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
