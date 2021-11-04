import { Component, h } from '@stencil/core';
import { MINUTE_IN_MS } from '../../utils/time';
import { NUMBER_QUERY, STRING_QUERY } from './siteWiseQueries';

const VIEWPORT = { duration: 5 * MINUTE_IN_MS };

@Component({
  tag: 'testing-ground',
  styleUrl: 'testing-ground.css',
})
export class TestingGround {
  render() {
    return (
      <div style={{ width: '600px' }}>
        <h1>KPI</h1>
        <iot-kpi query={STRING_QUERY} viewport={VIEWPORT} />
        <h1>Status Grid</h1>
        <iot-status-grid query={STRING_QUERY} viewport={VIEWPORT} />
        <h1>Line Chart</h1>
        <div style={{ width: '800px', height: '500px' }}>
          <iot-line-chart query={NUMBER_QUERY} viewport={VIEWPORT} />
        </div>
        <sc-webgl-context />
      </div>
    );
  }
}
