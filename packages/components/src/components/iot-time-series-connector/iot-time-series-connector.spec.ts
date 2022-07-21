import { newSpecPage } from '@stencil/core/testing';
import { MinimalLiveViewport } from '@synchro-charts/core';
import flushPromises from 'flush-promises';
import {
  initialize,
  createMockSiteWiseSDK,
  BATCH_ASSET_PROPERTY_VALUE_HISTORY,
  BATCH_ASSET_PROPERTY_DOUBLE_VALUE,
} from '@iot-app-kit/source-iotsitewise';
import { IotTimeSeriesConnector } from './iot-time-series-connector';
import { update } from '../../testing/update';
import { CustomHTMLElement } from '../../testing/types';
import { toSiteWiseAssetProperty } from '../../testing/dataStreamId';
import { Components } from '../../components';
import { DescribeAssetResponse, DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';
import { mockSiteWiseSDK } from '../../testing/mocks/siteWiseSDK';
import { DATA_STREAM, DATA_STREAM_2 } from '@iot-app-kit/core';
import { colorPalette } from '../common/colorPalette';

const createAssetResponse = ({
  assetId,
  assetModelId,
}: {
  assetId: string;
  assetModelId: string;
}): DescribeAssetResponse => ({
  assetId: assetId,
  assetName: `${assetId}-name`,
  assetModelId,
  assetCreationDate: undefined,
  assetLastUpdateDate: undefined,
  assetStatus: undefined,
  assetHierarchies: [],
  assetProperties: [],
  assetArn: undefined,
});

const createAssetModelResponse = ({
  propertyId,
  assetModelId,
}: {
  propertyId: string;
  assetModelId: string;
}): DescribeAssetModelResponse => ({
  assetModelId,
  assetModelName: `${assetModelId}-name`,
  assetModelDescription: undefined,
  assetModelProperties: [
    {
      id: propertyId,
      dataType: 'DOUBLE',
      name: 'property-name',
      unit: 'm/s',
      type: undefined,
    },
  ],
  assetModelStatus: undefined,
  assetModelCompositeModels: [],
  assetModelHierarchies: [],
  assetModelCreationDate: undefined,
  assetModelLastUpdateDate: undefined,
  assetModelArn: undefined,
});

const viewport: MinimalLiveViewport = {
  duration: 1000,
};

const connectorSpecPage = async (props: Partial<Components.IotTimeSeriesConnector>) => {
  const page = await newSpecPage({
    components: [IotTimeSeriesConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const connector = page.doc.createElement(
    'iot-time-series-connector'
  ) as CustomHTMLElement<Components.IotTimeSeriesConnector>;

  update(connector, props);

  page.body.appendChild(connector);

  await page.waitForChanges();

  return { page, connector };
};

it('renders', async () => {
  const renderFunc = jest.fn();

  const { query } = initialize({
    iotSiteWiseClient: mockSiteWiseSDK,
  });

  await connectorSpecPage({
    renderFunc,
    provider: query
      .timeSeriesData({ assets: [] })
      .build('widget-id', { viewport, settings: { fetchMostRecentBeforeEnd: true } }),
  });

  await flushPromises();

  expect(renderFunc).toBeCalledTimes(1);
  expect(renderFunc).toBeCalledWith({ dataStreams: [], viewport: { duration: 10 * 1000 * 60 } });
});

it('provides data streams', async () => {
  const renderFunc = jest.fn();

  const { assetId: assetId_1, propertyId: propertyId_1 } = toSiteWiseAssetProperty(DATA_STREAM.id);
  const { assetId: assetId_2, propertyId: propertyId_2 } = toSiteWiseAssetProperty(DATA_STREAM_2.id);

  const { query } = initialize({
    iotSiteWiseClient: mockSiteWiseSDK,
  });

  await connectorSpecPage({
    renderFunc,
    provider: query
      .timeSeriesData({
        assets: [
          { assetId: assetId_1, properties: [{ propertyId: propertyId_1 }] },
          { assetId: assetId_2, properties: [{ propertyId: propertyId_2 }] },
        ],
      })
      .build('widget-id', { viewport, settings: { fetchMostRecentBeforeEnd: true } }),
  });

  await flushPromises();

  expect(renderFunc).lastCalledWith({
    dataStreams: [
      expect.objectContaining({
        id: DATA_STREAM.id,
      }),
      expect.objectContaining({
        id: DATA_STREAM_2.id,
      }),
    ],
    viewport,
  });
});

it('populates the name, unit, and data type from the asset model information from SiteWise', async () => {
  const renderFunc = jest.fn();

  const { assetId: assetId_1, propertyId: propertyId_1 } = toSiteWiseAssetProperty(DATA_STREAM.id);
  const assetModelId = `${assetId_1}-asset-model`;

  const { query } = initialize({
    iotSiteWiseClient: createMockSiteWiseSDK({
      describeAsset: ({ assetId }) =>
        Promise.resolve(createAssetResponse({ assetId: assetId as string, assetModelId })),
      describeAssetModel: ({ assetModelId }) =>
        Promise.resolve(createAssetModelResponse({ assetModelId: assetModelId as string, propertyId: propertyId_1 })),
      batchGetAssetPropertyValueHistory: jest.fn().mockResolvedValue(BATCH_ASSET_PROPERTY_VALUE_HISTORY),
      batchGetAssetPropertyValue: jest.fn().mockResolvedValue(BATCH_ASSET_PROPERTY_DOUBLE_VALUE),
    }),
  });

  await connectorSpecPage({
    renderFunc,
    provider: query
      .timeSeriesData({
        assets: [{ assetId: assetId_1, properties: [{ propertyId: propertyId_1 }] }],
      })
      .build('widget-id', { viewport, settings: { fetchMostRecentBeforeEnd: true } }),
  });

  await flushPromises();

  expect(renderFunc).lastCalledWith({
    dataStreams: [
      expect.objectContaining({
        id: DATA_STREAM.id,
        name: 'property-name',
        unit: 'm/s',
        dataType: 'NUMBER',
      }),
    ],
    viewport,
  });
});

it('populates the name, unit, and data type from the asset model information from SiteWise when updating the connector', async () => {
  const renderFunc = jest.fn();

  const { assetId: assetId_1, propertyId: propertyId_1 } = toSiteWiseAssetProperty(DATA_STREAM.id);
  const assetModelId = `${assetId_1}-asset-model`;

  const { query } = initialize({
    iotSiteWiseClient: createMockSiteWiseSDK({
      describeAsset: ({ assetId }) =>
        Promise.resolve(createAssetResponse({ assetId: assetId as string, assetModelId })),
      describeAssetModel: ({ assetModelId }) =>
        Promise.resolve(createAssetModelResponse({ assetModelId: assetModelId as string, propertyId: propertyId_1 })),
      batchGetAssetPropertyValueHistory: jest.fn().mockResolvedValue(BATCH_ASSET_PROPERTY_VALUE_HISTORY),
      batchGetAssetPropertyValue: jest.fn().mockResolvedValue(BATCH_ASSET_PROPERTY_DOUBLE_VALUE),
    }),
  });

  const { connector, page } = await connectorSpecPage({
    renderFunc,
    provider: query
      .timeSeriesData({ assets: [] })
      .build('widget-id', { viewport, settings: { fetchMostRecentBeforeEnd: true } }),
  });

  await flushPromises();

  connector.provider = query
    .timeSeriesData({
      assets: [{ assetId: assetId_1, properties: [{ propertyId: propertyId_1 }] }],
    })
    .build('widget-id', { viewport, settings: { fetchMostRecentBeforeEnd: true } });

  await page.waitForChanges();
  await flushPromises();

  expect(renderFunc).lastCalledWith({
    dataStreams: [
      expect.objectContaining({
        id: DATA_STREAM.id,
        name: 'property-name',
        unit: 'm/s',
        dataType: 'NUMBER',
      }),
    ],
    viewport,
  });
});

it('updates with new queries', async () => {
  const { assetId: assetId_1, propertyId: propertyId_1 } = toSiteWiseAssetProperty(DATA_STREAM.id);
  const { assetId: assetId_2, propertyId: propertyId_2 } = toSiteWiseAssetProperty(DATA_STREAM_2.id);

  const renderFunc = jest.fn();

  const { query } = initialize({
    iotSiteWiseClient: mockSiteWiseSDK,
  });

  const { connector, page } = await connectorSpecPage({
    renderFunc,
    provider: query
      .timeSeriesData({ assets: [] })
      .build('widget-id', { viewport, settings: { fetchMostRecentBeforeEnd: true } }),
  });

  await flushPromises();

  connector.provider = query
    .timeSeriesData({
      assets: [
        { assetId: assetId_1, properties: [{ propertyId: propertyId_1 }] },
        { assetId: assetId_2, properties: [{ propertyId: propertyId_2 }] },
      ],
    })
    .build('widget-id', { viewport, settings: { fetchMostRecentBeforeEnd: true } });

  await page.waitForChanges();

  await flushPromises();

  expect(renderFunc).lastCalledWith({
    dataStreams: [
      expect.objectContaining({
        id: DATA_STREAM.id,
      }),
      expect.objectContaining({
        id: DATA_STREAM_2.id,
      }),
    ],
    viewport,
  });
});

it('binds styles to data streams', async () => {
  const renderFunc = jest.fn();
  const { assetId, propertyId } = toSiteWiseAssetProperty(DATA_STREAM.id);
  const REF_ID = 'some-ref-id';

  const { query } = initialize({
    iotSiteWiseClient: mockSiteWiseSDK,
  });

  await connectorSpecPage({
    renderFunc,
    provider: query
      .timeSeriesData({ assets: [{ assetId, properties: [{ propertyId, refId: REF_ID }] }] })
      .build('widget-id', { viewport, settings: { fetchMostRecentBeforeEnd: true } }),
    styleSettings: {
      [REF_ID]: {
        color: 'red',
        name: 'my-name',
      },
    },
  });

  expect(renderFunc).lastCalledWith({
    dataStreams: [
      expect.objectContaining({
        id: DATA_STREAM.id,
        refId: REF_ID,
        color: 'red',
        name: 'my-name',
      }),
    ],
    viewport,
  });
});

it('when assignDefaultColors is true, provides a default color', async () => {
  const renderFunc = jest.fn();
  const { assetId, propertyId } = toSiteWiseAssetProperty(DATA_STREAM.id);
  const REF_ID = 'some-ref-id';

  const { query } = initialize({
    iotSiteWiseClient: mockSiteWiseSDK,
  });

  await connectorSpecPage({
    renderFunc,
    provider: query
      .timeSeriesData({ assets: [{ assetId, properties: [{ propertyId, refId: REF_ID }] }] })
      .build('widget-id', { viewport, settings: { fetchMostRecentBeforeEnd: true } }),
    assignDefaultColors: true,
  });

  expect(renderFunc).lastCalledWith({
    dataStreams: [
      expect.objectContaining({
        color: colorPalette[0],
      }),
    ],
    viewport,
  });
});
