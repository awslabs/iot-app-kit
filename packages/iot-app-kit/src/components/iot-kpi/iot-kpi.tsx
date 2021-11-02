/* eslint-disable */
import { Component, Prop, h, State, Watch } from '@stencil/core';
import { DataStream, MinimalLiveViewport } from '@synchro-charts/core';
import isEqual from 'lodash.isequal';
import { DataStreamQuery, getDataModule, SubscriptionUpdate } from '../../data-module';
import { MINUTE_IN_MS, parseDuration } from '../../utils/time';
import { DATA_STREAM } from '../../testing/__mocks__/mockWidgetProperties';

@Component({
  tag: 'iot-kpi',
  shadow: false,
})
export class IotKpi {
  @Prop() query: DataStreamQuery;
  @Prop() widgetId: string; // make optional
  @Prop() viewport: MinimalLiveViewport | undefined;
  @Prop() isEditing: boolean | undefined;

  @State() dataStreams: DataStream[] = [DATA_STREAM];

  private update: (subscriptionUpdate: SubscriptionUpdate<DataStreamQuery>) => void;
  private unsubscribe: () => void;

  componentDidLoad() {
    const { update, unsubscribe } = getDataModule().subscribeToDataStreams(
      {
        query: this.query,
        requestInfo: {
          onlyFetchLatestValue: true,
          duration: this.getDuration(),
        },
      },
      (dataStreams: DataStream[]) => {
        // this.dataStreams = dataStreams;
      }
    );

    this.update = update;
    this.unsubscribe = unsubscribe;
  }

  componentDidUnmount() {
    this.unsubscribe();
  }

  /**
   * Sync subscription to requested query / viewport
   */
  @Watch('viewport')
  @Watch('query')
  onUpdateProp(newProp: unknown, oldProp: unknown) {
    if (!isEqual(newProp, oldProp) && this.update != null) {
      this.update({
        query: this.query,
        requestInfo: {
          onlyFetchLatestValue: true,
          duration: this.getDuration(),
        },
      });
    }
  }

  getDuration(): number {
    return this.viewport == null ? MINUTE_IN_MS : parseDuration(this.viewport.duration) || MINUTE_IN_MS;
  }

  render() {
    return (
      <sc-kpi
        viewport={this.viewport}
        isEditing={this.isEditing}
        widgetId={this.widgetId}
        dataStreams={this.dataStreams}
      />
    );
  }
}
