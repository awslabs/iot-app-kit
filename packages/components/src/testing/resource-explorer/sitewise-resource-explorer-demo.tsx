import { Component, h } from '@stencil/core';
import { DataModule, initialize, SiteWiseAssetTreeQuery } from '@iot-app-kit/core';
import { getEnvCredentials } from '../testing-ground/getEnvCredentials';

@Component({
  tag: 'sitewise-resource-explorer-demo',
  styleUrl: '../../styles/awsui.css',
})
export class SitewiseResourceExplorerDemo {
  private dataModule: DataModule;

  componentWillLoad() {
    this.dataModule = initialize({ awsCredentials: getEnvCredentials(), awsRegion: 'us-east-1' });
  }

  query: SiteWiseAssetTreeQuery = { rootAssetId: undefined };

  render() {
    return <sitewise-resource-explorer query={this.query} />;
  }
}
