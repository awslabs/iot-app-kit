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
