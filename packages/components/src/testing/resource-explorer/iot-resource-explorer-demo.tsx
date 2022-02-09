import { Component, h } from '@stencil/core';
import { initialize, IoTAppKit, SiteWiseAssetTreeQuery } from '@iot-app-kit/core';
import { getEnvCredentials } from '../testing-ground/getEnvCredentials';
import { ResourceExplorerQuery } from '../../components/iot-resource-explorer/types';

@Component({
  tag: 'iot-resource-explorer-demo',
  styleUrl: '../../styles/awsui.css',
})
export class IotResourceExplorerDemo {
  private appKit: IoTAppKit;

  componentWillLoad() {
    this.appKit = initialize({ awsCredentials: getEnvCredentials(), awsRegion: 'us-east-1' });
  }

  query: ResourceExplorerQuery & SiteWiseAssetTreeQuery = { source: 'site-wise' };

  render() {
    return <iot-resource-explorer appKit={this.appKit} query={this.query} />;
  }
}
