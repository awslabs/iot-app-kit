import { Component, h } from '@stencil/core';
import {
  initialize,
  type SiteWiseQuery,
} from '@iot-app-kit/source-iotsitewise';
import { getEnvCredentials } from '../testing-ground/getEnvCredentials';

@Component({
  tag: 'iot-resource-explorer-demo',
  styleUrl: '../../styles/awsui.css',
})
export class IotResourceExplorerDemo {
  private query: SiteWiseQuery;

  componentWillLoad() {
    const { query } = initialize({
      awsCredentials: getEnvCredentials(),
      awsRegion: 'us-east-1',
    });
    this.query = query;
  }

  render() {
    return <iot-resource-explorer query={this.query.assetTree.fromRoot()} />;
  }
}
