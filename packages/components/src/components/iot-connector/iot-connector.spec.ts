import { newSpecPage } from '@stencil/core/testing';
import { MinimalLiveViewport } from '@synchro-charts/core';
import flushPromises from 'flush-promises';
import { registerDataSource, initialize, SiteWiseDataStreamQuery } from '@iot-app-kit/core';
import { IotConnector } from './iot-connector';
import { createMockSource } from '../../testing/createMockSource';
import { update } from '../../testing/update';
import { CustomHTMLElement } from '../../testing/types';
import { DATA_STREAM } from '../../testing/mockWidgetProperties';
import { toSiteWiseAssetProperty } from '../../testing/dataStreamId';
import { Components } from '../../components';

const viewport: MinimalLiveViewport = {
  duration: 1000,
};

const connectorSpecPage = async (propOverrides: Partial<Components.IotConnector> = {}) => {
  /** Initialize data source and register mock data source */
  const appKit = initialize({ registerDataSources: false });
  registerDataSource(appKit, createMockSource([DATA_STREAM]));

  const page = await newSpecPage({
    components: [IotConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const connector = page.doc.createElement('iot-connector') as CustomHTMLElement<Components.IotConnector>;
  const props: Partial<Components.IotConnector> = {
    appKit,
    query: {
      source: 'test-mock',
      assets: [],
    } as SiteWiseDataStreamQuery, // static casting because of legacy sw
    requestInfo: { viewport, onlyFetchLatestValue: true },
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
  const { assetId, propertyId } = toSiteWiseAssetProperty(DATA_STREAM.id);

  await connectorSpecPage({
    renderFunc,
    query: {
      source: 'test-mock',
      assets: [{ assetId, properties: [{ propertyId }] }],
    } as SiteWiseDataStreamQuery,
  });

  await flushPromises();

  expect(renderFunc).lastCalledWith({
    dataStreams: [
      expect.objectContaining({
        id: DATA_STREAM.id,
      }),
    ],
  });
});

it('updates with new query', async () => {
  const { assetId, propertyId } = toSiteWiseAssetProperty(DATA_STREAM.id);
  const renderFunc = jest.fn();
  const { connector, page } = await connectorSpecPage({
    renderFunc,
    query: {
      source: 'test-mock',
      assets: [],
    } as SiteWiseDataStreamQuery,
  });
  await flushPromises();

  connector.query = {
    source: 'test-mock',
    assets: [{ assetId, properties: [{ propertyId }] }],
  } as SiteWiseDataStreamQuery;

  await page.waitForChanges();
  await flushPromises();

  expect(renderFunc).lastCalledWith({
    dataStreams: [
      expect.objectContaining({
        id: DATA_STREAM.id,
      }),
    ],
  });
});
