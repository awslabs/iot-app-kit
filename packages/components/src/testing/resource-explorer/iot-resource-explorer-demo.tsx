import { Component, h, State } from '@stencil/core';
import { DataModule, initialize, SiteWiseAssetTreeQuery } from '@iot-app-kit/core';
import { getEnvCredentials } from '../testing-ground/getEnvCredentials';
import { ResourceExplorerQuery } from '../../components/iot-resource-explorer/types';

@Component({
  tag: 'iot-resource-explorer-demo',
  styleUrl: '../../styles/awsui.css',
})
export class IotResourceExplorerDemo {
  private dataModule: DataModule;

  componentWillLoad() {
    this.dataModule = initialize({ awsCredentials: getEnvCredentials(), awsRegion: 'us-east-1' });
  }

  query: ResourceExplorerQuery & SiteWiseAssetTreeQuery = { source: 'site-wise', rootAssetId: undefined };

  render() {
    return <iot-resource-explorer appKit={this.dataModule} query={this.query} />;
  }
}
