import { Component, h } from '@stencil/core';
import { initialize, IoTAppKit, query, SiteWiseAssetTreeQuery } from '@iot-app-kit/core';
import { getEnvCredentials } from '../testing-ground/getEnvCredentials';

@Component({
  tag: 'iot-resource-explorer-demo',
  styleUrl: '../../styles/awsui.css',
})
export class IotResourceExplorerDemo {
  private appKit: IoTAppKit;

  componentWillLoad() {
    this.appKit = initialize({ awsCredentials: getEnvCredentials(), awsRegion: 'us-east-1' });
  }

  query: SiteWiseAssetTreeQuery = query.iotsitewise.assetTree.fromRoot();

  render() {
    return <iot-resource-explorer appKit={this.appKit} query={this.query} />;
  }
}
