import { Component, h, State } from '@stencil/core';
import { initialize, IoTAppKitSession, SiteWiseAssetTreeQuery } from '@iot-app-kit/core';
import { getEnvCredentials } from '../testing-ground/getEnvCredentials';
import { ResourceExplorerQuery } from '../../components/iot-resource-explorer/types';

@Component({
  tag: 'iot-resource-explorer-demo',
  styleUrl: '../../styles/awsui.css',
})
export class IotResourceExplorerDemo {
  private appKitSession: IoTAppKitSession;

  componentWillLoad() {
    this.appKitSession = initialize({ awsCredentials: getEnvCredentials(), awsRegion: 'us-east-1' }).session();
  }

  query: ResourceExplorerQuery & SiteWiseAssetTreeQuery = { source: 'site-wise', rootAssetId: undefined };

  render() {
    return <iot-resource-explorer appKitSession={this.appKitSession} query={this.query} />;
  }
}
