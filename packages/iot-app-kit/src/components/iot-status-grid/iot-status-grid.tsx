import { Component, Prop, h } from '@stencil/core';
import { MinimalViewPortConfig } from '@synchro-charts/core';
import { DataStreamQuery } from '../../data-module';
import { RequestInfo } from '../../data-module/data-cache/requestTypes';
import { MINUTE_IN_MS } from '../../utils/time';

const DEFAULT_VIEWPORT = { duration: 10 * MINUTE_IN_MS };

@Component({
  tag: 'iot-status-grid',
  shadow: false,
})
export class IotStatusGrid {
  @Prop() query: DataStreamQuery;

  @Prop() viewport: MinimalViewPortConfig = DEFAULT_VIEWPORT;

  @Prop() widgetId: string;

  @Prop() isEditing: boolean | undefined;

  requestInfo(): RequestInfo {
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
          <sc-status-grid
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
