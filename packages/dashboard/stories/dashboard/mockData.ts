export const WIND_FARM_ID = '03027cc7-8cd9-4d88-a618-2254813c5104';

const assetsTopLevel = {
  assetSummaries: [
    {
      arn: 'arn:aws:iotsitewise:us-east-1:376853352654:asset/668f6d68-4b54-43bd-98f6-594b5c17dae7',
      assetModelId: WIND_FARM_ID,
      creationDate: 1669924336,
      hierarchies: [
        {
          id: '57ebe588-7c04-47f2-9537-8c2bc1a1ed7c',
          name: 'Turbine Asset Model',
        },
      ],
      id: '668f6d68-4b54-43bd-98f6-594b5c17dae7',
      lastUpdateDate: 1669924336,
      name: 'Demo Wind Farm Asset',
      status: {
        state: 'ACTIVE',
      },
    },
  ],
};

const assetsTurbines = {
  assetSummaries: [
    {
      arn: 'arn:aws:iotsitewise:us-east-1:376853352654:asset/e9a995de-149e-4f6d-afa6-f073b863a050',
      assetModelId: 'cb0e7544-83d4-4eae-976d-81d266bf4bb8',
      creationDate: 1669924323,
      hierarchies: [
        {
          id: '65ad42d6-c0fa-4caa-ad1c-b08138d36646',
          name: 'Turbine Sensor Asset Model',
        },
      ],
      id: 'e9a995de-149e-4f6d-afa6-f073b863a050',
      lastUpdateDate: 1669925074,
      name: 'Demo Turbine Asset 1',
      status: {
        state: 'ACTIVE',
      },
    },
    {
      arn: 'arn:aws:iotsitewise:us-east-1:376853352654:asset/ed9cd35a-58b8-4ad7-8ad2-6d6128f9c526',
      assetModelId: 'cb0e7544-83d4-4eae-976d-81d266bf4bb8',
      creationDate: 1669924322,
      hierarchies: [],
      id: 'ed9cd35a-58b8-4ad7-8ad2-6d6128f9c526',
      lastUpdateDate: 1669925074,
      name: 'Demo Turbine Asset 2',
      status: {
        state: 'ACTIVE',
      },
    },
    {
      arn: 'arn:aws:iotsitewise:us-east-1:376853352654:asset/a673f207-ee3b-4672-ab6a-cf3b8eede526',
      assetModelId: 'cb0e7544-83d4-4eae-976d-81d266bf4bb8',
      creationDate: 1669924323,
      hierarchies: [],
      id: 'a673f207-ee3b-4672-ab6a-cf3b8eede526',
      lastUpdateDate: 1669925074,
      name: 'Demo Turbine Asset 3',
      status: {
        state: 'ACTIVE',
      },
    },
    {
      arn: 'arn:aws:iotsitewise:us-east-1:376853352654:asset/d367248d-cb8c-46d2-aa99-902a735da410',
      assetModelId: 'cb0e7544-83d4-4eae-976d-81d266bf4bb8',
      creationDate: 1669924323,
      hierarchies: [],
      id: 'd367248d-cb8c-46d2-aa99-902a735da410',
      lastUpdateDate: 1669925146,
      name: 'Demo Turbine Asset 4',
      status: {
        state: 'ACTIVE',
      },
    },
  ],
};

const assetsTurbineSensors = {
  assetSummaries: [
    {
      arn: 'arn:aws:iotsitewise:us-east-1:376853352654:asset/21ecb242-08ec-4f61-92c4-11c6a4c403fa',
      assetModelId: 'e3296bea-dec3-48f9-a9a0-2278ae8ae007',
      creationDate: 1669925109,
      hierarchies: [],
      id: '21ecb242-08ec-4f61-92c4-11c6a4c403fa',
      lastUpdateDate: 1669925109,
      name: 'Turbine Sensor 1138',
      status: {
        state: 'ACTIVE',
      },
    },
  ],
};

export const mockListAssets = (args: { filter: string }) => {
  if (args.filter === 'TOP_LEVEL') {
    return Promise.resolve(assetsTopLevel);
  }
  throw new Error(
    `mockListAssets can't be called with a filter other than TOP_LEVEL.`
  );
};

export const mockListAssociatedAssets = (args: { assetId: string }) => {
  if (args.assetId === '668f6d68-4b54-43bd-98f6-594b5c17dae7') {
    return Promise.resolve(assetsTurbines);
  }
  if (args.assetId === 'e9a995de-149e-4f6d-afa6-f073b863a050') {
    return Promise.resolve(assetsTurbineSensors);
  }
  throw new Error(
    `mockListAssociatedAssets must be called with Wind Farm asset's ID or Turbine 1 asset's ID`
  );
};

export const MOCK_DASHBOARD_CONFIG = {
  displaySettings: {
    numColumns: 100,
    numRows: 100,
    cellSize: 20,
    significantDigits: 4,
  },
  widgets: [
    {
      id: 'nlR8v1cR8PEZgo2Xwu__u',
      type: 'xy-plot',
      width: 33,
      height: 20,
      x: 0,
      y: 0,
      z: 0,
      properties: {
        aggregationType: 'AVERAGE',
        queryConfig: {
          source: 'iotsitewise',
          query: {
            assets: [
              {
                assetId: '57c74eb3-b76c-47e3-ba85-2b9898a2bd9f',
                properties: [
                  {
                    propertyId: '72596d73-b488-48b8-a476-e4020b9e1df9',
                    refId: '6fc6fe0a-a7ef-4b5b-9c79-05c25f4d4b29',
                    aggregationType: 'AVERAGE',
                    color: '#7d2105',
                  },
                  {
                    propertyId: '099f6948-d87b-47ee-ba77-628a132e0273',
                    refId: 'fbaa620b-c1b1-4b30-9355-666a359b50dd',
                    aggregationType: 'AVERAGE',
                    color: '#3184c2',
                  },
                ],
              },
            ],
            properties: [],
            assetModels: [],
          },
        },
        line: {
          connectionStyle: 'linear',
          style: 'solid',
        },
        symbol: {
          style: 'filled-circle',
        },
        axis: {
          yVisible: true,
          xVisible: true,
        },
        legend: {
          visible: true,
          position: 'right',
          width: '30%',
          height: '30%',
          visibleContent: {
            unit: true,
            asset: true,
            latestValue: true,
            maxValue: false,
            minValue: false,
          },
        },
      },
    },
    {
      id: '3m4RWZ3P2T3uF5ERro9Bf',
      type: 'kpi',
      width: 16,
      height: 10,
      x: 0,
      y: 21,
      z: 0,
      properties: {
        resolution: '0',
        queryConfig: {
          source: 'iotsitewise',
          query: {
            assets: [
              {
                assetId: '57c74eb3-b76c-47e3-ba85-2b9898a2bd9f',
                properties: [
                  {
                    propertyId: '72596d73-b488-48b8-a476-e4020b9e1df9',
                    resolution: '0',
                    refId: 'fd17461c-96b4-47b2-880b-897c2b43500a',
                  },
                ],
              },
            ],
            properties: [],
            assetModels: [],
          },
        },
        primaryFont: {},
        secondaryFont: {},
        showName: true,
        showTimestamp: true,
        showUnit: true,
        showAggregationAndResolution: true,
        showDataQuality: true,
        styleSettings: {
          'fd17461c-96b4-47b2-880b-897c2b43500a': {
            color: '#7d2105',
          },
        },
      },
    },
    {
      id: 'Lhdx3QnokTFlA2ozomsia',
      type: 'kpi',
      width: 16,
      height: 10,
      x: 17,
      y: 21,
      z: 0,
      properties: {
        resolution: '0',
        queryConfig: {
          source: 'iotsitewise',
          query: {
            assets: [
              {
                assetId: '57c74eb3-b76c-47e3-ba85-2b9898a2bd9f',
                properties: [
                  {
                    propertyId: '099f6948-d87b-47ee-ba77-628a132e0273',
                    resolution: '0',
                    refId: 'fc7e3cd1-3d23-489f-b8f7-ff9ea0006e58',
                  },
                ],
              },
            ],
            properties: [],
            assetModels: [],
          },
        },
        primaryFont: {},
        secondaryFont: {},
        showName: true,
        showTimestamp: true,
        showUnit: true,
        showAggregationAndResolution: true,
        showDataQuality: true,
        styleSettings: {
          'fc7e3cd1-3d23-489f-b8f7-ff9ea0006e58': {
            color: '#7d2105',
          },
        },
      },
    },
  ],
  defaultViewport: {
    duration: '10m',
  },
};
