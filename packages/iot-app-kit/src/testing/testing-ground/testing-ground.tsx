import { Component, h } from '@stencil/core';
import { MINUTE_IN_MS } from '../../utils/time';
import { DATA_SOURCE_NAME } from '../../data-sources/site-wise/data-source';
import { SiteWiseDataStreamQuery } from '../../data-sources/site-wise/types.d';

@Component({
  tag: 'testing-ground',
  styleUrl: 'testing-ground.css',
})
export class TestingGround {
  render() {
    return (
      <div style={{ width: '200px' }}>
        <h1>IoT Application Kit</h1>
        <iot-kpi
          widgetId="my-test-kpi"
          query={
            {
              source: DATA_SOURCE_NAME,
              assets: [{ assetId: 'some-fake-asset', propertyIds: ['some-property-id'] }],
            } as SiteWiseDataStreamQuery
          }
          viewport={{ duration: 10 * MINUTE_IN_MS }}
          isEditing={false}
        />
      </div>
    );
  }
}
