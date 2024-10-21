import {
  type AlarmResource,
  type TimeSeriesResource,
} from '@iot-app-kit/react-components';
import { ModeledDataStream } from '../modeledDataStreamQueryEditor/modeledDataStreamExplorer/types';
import { QueryExtender } from './queryExtender';

describe(QueryExtender.name, () => {
  describe('extendAssetQueries', () => {
    it('should extend the current query with new asset queries', () => {
      const currentQuery = {
        assets: [
          {
            assetId: 'asset-1',
            properties: [{ propertyId: 'property-1' }],
          },
        ],
        properties: [{ propertyAlias: 'property-1' }],
      };
      const queryExtender = new QueryExtender(currentQuery);
      const modeledDataStreams = [
        {
          assetId: 'asset-2',
          propertyId: 'property-2',
        },
      ] as ModeledDataStream[];

      const extendedQuery =
        queryExtender.extendAssetQueries(modeledDataStreams);

      expect(extendedQuery).toEqual({
        assets: [
          {
            assetId: 'asset-1',
            properties: [{ propertyId: 'property-1' }],
          },
          {
            assetId: 'asset-2',
            properties: [{ propertyId: 'property-2' }],
          },
        ],
        properties: [{ propertyAlias: 'property-1' }],
      });
    });

    it('should dedupe asset queries with properties', () => {
      const currentQuery = {
        assets: [
          {
            assetId: 'asset-1',
            properties: [{ propertyId: 'property-1' }],
          },
        ],
      };
      const queryExtender = new QueryExtender(currentQuery);
      const modeledDataStreams = [
        {
          assetId: 'asset-1',
          propertyId: 'property-1',
        },
        {
          assetId: 'asset-1',
          propertyId: 'property-2',
        },
      ] as ModeledDataStream[];

      const extendedQuery =
        queryExtender.extendAssetQueries(modeledDataStreams);

      expect(extendedQuery).toEqual({
        assets: [
          {
            assetId: 'asset-1',
            properties: [
              { propertyId: 'property-1' },
              { propertyId: 'property-2' },
            ],
          },
        ],
      });
    });

    it('should initialize with an empty query when no argument is passed', () => {
      const queryExtender = new QueryExtender();
      const extendedQuery = queryExtender.extendAssetQueries([]);

      expect(extendedQuery).toEqual({ assets: [] });
    });

    it('should return the current query when an empty array is passed to extendAssetQueries', () => {
      const currentQuery = {
        assets: [
          {
            assetId: 'asset-1',
            properties: [{ propertyId: 'property-1' }],
          },
        ],
        properties: [{ propertyAlias: 'property-1' }],
      };
      const queryExtender = new QueryExtender(currentQuery);
      const extendedQuery = queryExtender.extendAssetQueries([]);

      expect(extendedQuery).toEqual(currentQuery);
    });
  });

  describe('extendPropertyAliasQueries', () => {
    it('should extend the current query with new property alias queries', () => {
      const currentQuery = {
        assets: [
          {
            assetId: 'asset-1',
            properties: [{ propertyId: 'property-1' }],
          },
        ],
        properties: [{ propertyAlias: 'property-1' }],
      };
      const queryExtender = new QueryExtender(currentQuery);
      const unmodeledDataStreams = [
        { alias: 'property-2' },
      ] as TimeSeriesResource[];

      const extendedQuery =
        queryExtender.extendPropertyAliasQueries(unmodeledDataStreams);

      expect(extendedQuery).toEqual({
        assets: [
          {
            assetId: 'asset-1',
            properties: [{ propertyId: 'property-1' }],
          },
        ],
        properties: [
          { propertyAlias: 'property-1' },
          { propertyAlias: 'property-2' },
        ],
      });
    });

    it('should dedupe property alias queries', () => {
      const currentQuery = {
        properties: [{ propertyAlias: 'property-1' }],
      };
      const queryExtender = new QueryExtender(currentQuery);
      const unmodeledDataStreams = [
        { alias: 'property-1' },
        { alias: 'property-2' },
      ] as TimeSeriesResource[];

      const extendedQuery =
        queryExtender.extendPropertyAliasQueries(unmodeledDataStreams);

      expect(extendedQuery.properties).toEqual([
        { propertyAlias: 'property-1' },
        { propertyAlias: 'property-2' },
      ]);
    });
  });

  it('should initialize with an empty query when no argument is passed', () => {
    const queryExtender = new QueryExtender();
    const extendedQuery = queryExtender.extendPropertyAliasQueries([]);

    expect(extendedQuery).toEqual({ properties: [] });
  });

  it('should return the current query when an empty array is passed to extendAssetQueries', () => {
    const currentQuery = {
      assets: [
        {
          assetId: 'asset-1',
          properties: [{ propertyId: 'property-1' }],
        },
      ],
      properties: [{ propertyAlias: 'property-1' }],
    };
    const queryExtender = new QueryExtender(currentQuery);
    const extendedQuery = queryExtender.extendPropertyAliasQueries([]);

    expect(extendedQuery).toEqual(currentQuery);
  });

  describe('extendAlarmQueries', () => {
    it('should extend the current query with new alarm queries', () => {
      const currentQuery = {
        alarms: [
          {
            assetId: 'asset-1',
            alarmComponents: [{ assetCompositeModelId: 'alarm-1' }],
          },
        ],
        assets: [
          {
            assetId: 'asset-1',
            properties: [{ propertyId: 'property-1' }],
          },
        ],
        properties: [{ propertyAlias: 'property-1' }],
      };
      const queryExtender = new QueryExtender(currentQuery);
      const modeledAlarmStreams = [
        {
          assetId: 'asset-2',
          assetCompositeModelId: 'alarm-2',
        },
      ] as AlarmResource[];

      const extendedQuery =
        queryExtender.extendAlarmQueries(modeledAlarmStreams);

      expect(extendedQuery).toEqual({
        alarms: [
          {
            assetId: 'asset-1',
            alarmComponents: [{ assetCompositeModelId: 'alarm-1' }],
          },
          {
            assetId: 'asset-2',
            alarmComponents: [{ assetCompositeModelId: 'alarm-2' }],
          },
        ],
        assets: [
          {
            assetId: 'asset-1',
            properties: [{ propertyId: 'property-1' }],
          },
        ],
        properties: [{ propertyAlias: 'property-1' }],
      });
    });

    it('should dedupe alarm queries with properties', () => {
      const currentQuery = {
        alarms: [
          {
            assetId: 'asset-1',
            alarmComponents: [{ assetCompositeModelId: 'alarm-1' }],
          },
        ],
      };
      const queryExtender = new QueryExtender(currentQuery);
      const modeledAlarmStreams = [
        {
          assetId: 'asset-1',
          assetCompositeModelId: 'alarm-1',
        },
        {
          assetId: 'asset-1',
          assetCompositeModelId: 'alarm-2',
        },
      ] as AlarmResource[];

      const extendedQuery =
        queryExtender.extendAlarmQueries(modeledAlarmStreams);

      expect(extendedQuery).toEqual({
        alarms: [
          {
            assetId: 'asset-1',
            alarmComponents: [
              { assetCompositeModelId: 'alarm-1' },
              { assetCompositeModelId: 'alarm-2' },
            ],
          },
        ],
      });
    });

    it('should initialize with an empty query when no argument is passed', () => {
      const queryExtender = new QueryExtender();
      const extendedQuery = queryExtender.extendAlarmQueries([]);

      expect(extendedQuery).toEqual({ alarms: [] });
    });

    it('should return the current query when an empty array is passed to extendAssetQueries', () => {
      const currentQuery = {
        alarms: [
          {
            assetId: 'asset-1',
            alarmComponents: [{ assetCompositeModelId: 'alarm-1' }],
          },
        ],
        assets: [
          {
            assetId: 'asset-1',
            properties: [{ propertyId: 'property-1' }],
          },
        ],
        properties: [{ propertyAlias: 'property-1' }],
      };
      const queryExtender = new QueryExtender(currentQuery);
      const extendedQuery = queryExtender.extendAlarmQueries([]);

      expect(extendedQuery).toEqual(currentQuery);
    });
  });
});
