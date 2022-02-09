import { newSpecPage } from '@stencil/core/testing';
import { MinimalLiveViewport } from '@synchro-charts/core';
import flushPromises from 'flush-promises';
import { initialize, SiteWiseDataStreamQuery, IoTAppKitInitInputs, createMockSiteWiseSDK } from '@iot-app-kit/core';
import { IotConnector } from './iot-connector';
import { createMockSource } from '../../testing/createMockSource';
import { update } from '../../testing/update';
import { CustomHTMLElement } from '../../testing/types';
import { DATA_STREAM, DATA_STREAM_2 } from '../../testing/mockWidgetProperties';
import { toSiteWiseAssetProperty } from '../../testing/dataStreamId';
import { Components } from '../../components';
import { DescribeAssetResponse, DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';

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

const connectorSpecPage = async (
  propOverrides: Partial<Components.IotConnector> = {},
  appKitInitOverrides: Partial<IoTAppKitInitInputs> = {}
) => {
  /** Initialize data source and register mock data source */
  const appKitSession = initialize({ registerDataSources: false, ...appKitInitOverrides }).session();
  appKitSession.registerDataSource(createMockSource([DATA_STREAM, DATA_STREAM_2]));

  const page = await newSpecPage({
    components: [IotConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const connector = page.doc.createElement('iot-connector') as CustomHTMLElement<Components.IotConnector>;
  const props: Partial<Components.IotConnector> = {
    appKitSession,
    queries: [
      {
        source: 'test-mock',
        assets: [],
      } as SiteWiseDataStreamQuery,
    ], // static casting because of legacy sw
    request: { viewport, settings: { fetchMostRecentBeforeEnd: true } },
    ...propOverrides,
  };
  update(connector, props);
  page.body.appendChild(connector);

  await page.waitForChanges();

  return { page, connector };
};

it('renders', async () => {
  const renderFunc = jest.fn();
  await connectorSpecPage({ renderFunc });
  await flushPromises();
  expect(renderFunc).toBeCalledTimes(1);
  expect(renderFunc).toBeCalledWith({ dataStreams: [] });
});

it('provides data streams', async () => {
  const renderFunc = jest.fn();
  const { assetId: assetId_1, propertyId: propertyId_1 } = toSiteWiseAssetProperty(DATA_STREAM.id);
  const { assetId: assetId_2, propertyId: propertyId_2 } = toSiteWiseAssetProperty(DATA_STREAM_2.id);

  await connectorSpecPage({
    renderFunc,
    queries: [
      {
        source: 'test-mock',
        assets: [{ assetId: assetId_1, properties: [{ propertyId: propertyId_1 }] }],
      } as SiteWiseDataStreamQuery,
      {
        source: 'test-mock',
        assets: [{ assetId: assetId_2, properties: [{ propertyId: propertyId_2 }] }],
      } as SiteWiseDataStreamQuery,
    ],
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
  });
});

it('populates the name, unit, and data type from the asset model information from SiteWise', async () => {
  const renderFunc = jest.fn();
  const { assetId: assetId_1, propertyId: propertyId_1 } = toSiteWiseAssetProperty(DATA_STREAM.id);
  const assetModelId = `${assetId_1}-asset-model`;

  await connectorSpecPage(
    {
      renderFunc,
      queries: [
        {
          source: 'test-mock',
          assets: [{ assetId: assetId_1, properties: [{ propertyId: propertyId_1 }] }],
        } as SiteWiseDataStreamQuery,
      ],
    },
    {
      iotSiteWiseClient: createMockSiteWiseSDK({
        describeAsset: ({ assetId }) =>
          Promise.resolve(createAssetResponse({ assetId: assetId as string, assetModelId })),
        describeAssetModel: ({ assetModelId }) =>
          Promise.resolve(createAssetModelResponse({ assetModelId: assetModelId as string, propertyId: propertyId_1 })),
      }),
    }
  );

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
  });
});

// TODO: Implement updating behavior to make this test pass.
it.skip('populates the name, unit, and data type from the asset model information from SiteWise when updating the connector', async () => {
  const renderFunc = jest.fn();
  const { assetId: assetId_1, propertyId: propertyId_1 } = toSiteWiseAssetProperty(DATA_STREAM.id);
  const assetModelId = `${assetId_1}-asset-model`;

  const { connector, page } = await connectorSpecPage(
    {
      renderFunc,
      queries: [
        {
          source: 'test-mock',
          assets: [],
        } as SiteWiseDataStreamQuery,
      ],
    },
    {
      iotSiteWiseClient: createMockSiteWiseSDK({
        describeAsset: ({ assetId }) =>
          Promise.resolve(createAssetResponse({ assetId: assetId as string, assetModelId })),
        describeAssetModel: ({ assetModelId }) =>
          Promise.resolve(createAssetModelResponse({ assetModelId: assetModelId as string, propertyId: propertyId_1 })),
      }),
    }
  );

  await flushPromises();

  connector.queries = [
    {
      source: 'test-mock',
      assets: [{ assetId: assetId_1, properties: [{ propertyId: propertyId_1 }] }],
    } as SiteWiseDataStreamQuery,
  ];

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
  });
});

it('updates with new queries', async () => {
  const { assetId: assetId_1, propertyId: propertyId_1 } = toSiteWiseAssetProperty(DATA_STREAM.id);
  const { assetId: assetId_2, propertyId: propertyId_2 } = toSiteWiseAssetProperty(DATA_STREAM_2.id);

  const renderFunc = jest.fn();
  const { connector, page } = await connectorSpecPage({
    renderFunc,
    queries: [
      {
        source: 'test-mock',
        assets: [],
      } as SiteWiseDataStreamQuery,
    ],
  });
  await flushPromises();

  connector.queries = [
    {
      source: 'test-mock',
      assets: [{ assetId: assetId_1, properties: [{ propertyId: propertyId_1 }] }],
    } as SiteWiseDataStreamQuery,
    {
      source: 'test-mock',
      assets: [{ assetId: assetId_2, properties: [{ propertyId: propertyId_2 }] }],
    } as SiteWiseDataStreamQuery,
  ];

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
  });
});

it('binds styles to data streams', async () => {
  const renderFunc = jest.fn();
  const { assetId, propertyId } = toSiteWiseAssetProperty(DATA_STREAM.id);
  const REF_ID = 'some-ref-id';

  await connectorSpecPage({
    renderFunc,
    styleSettings: {
      [REF_ID]: {
        color: 'red',
        name: 'my-name',
      },
    },
    queries: [
      {
        source: 'test-mock',
        assets: [{ assetId, properties: [{ propertyId, refId: REF_ID }] }],
      } as SiteWiseDataStreamQuery,
    ],
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
  });
});
