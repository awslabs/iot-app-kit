import { Component, h } from '@stencil/core';
import { initialize } from '@iot-app-kit/core';
import { NUMBER_QUERY, ASSET_DETAILS_QUERY } from './siteWiseQueries';
import { getEnvCredentials } from './getEnvCredentials';

const VIEWPORT = { duration: 3 * 1000 * 60 };

@Component({
  tag: 'testing-ground',
  styleUrl: 'testing-ground.css',
})
export class TestingGround {
  componentWillLoad() {
    initialize({ awsCredentials: getEnvCredentials(), awsRegion: 'us-east-1' });
  }

  render() {
    return (
      <div style={{ width: '600px' }}>
        <sc-webgl-context />
        <iot-kpi query={NUMBER_QUERY} viewport={VIEWPORT} />
        <iot-status-grid query={NUMBER_QUERY} viewport={VIEWPORT} />
        <div style={{ width: '400px', height: '500px' }}>
          <iot-line-chart query={NUMBER_QUERY} viewport={VIEWPORT} />
        </div>
        <iot-asset-details query={ASSET_DETAILS_QUERY} />
        <iot-asset-tree-demo query={{ rootAssetId: undefined }} />
      </div>
    );
  }
}
