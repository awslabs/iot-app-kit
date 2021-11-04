import { newSpecPage } from '@stencil/core/testing';
import { MinimalLiveViewport } from '@synchro-charts/core';
import flushPromises from 'flush-promises';
import { SECOND_IN_MS } from '../utils/time';
import { getDataModule, resetDataModule } from '../data-module';
import { Components } from '../components.d';
import { DATA_STREAM } from '../testing/__mocks__/mockWidgetProperties';
import { CustomHTMLElement } from '../utils/types';
import { SiteWiseDataStreamQuery } from '../data-sources/site-wise/types.d';
import { update } from './tests/merge';
import { IotConnector } from './iot-connector';
import { createMockSource } from '../testing/testing-ground/createMockSource';
import { toSiteWiseAssetProperty } from '../data-sources/site-wise/util/dataStreamId';

const viewport: MinimalLiveViewport = {
  duration: SECOND_IN_MS,
};

const connectorSpecPage = async (propOverrides: Partial<Components.IotConnector> = {}) => {
  getDataModule().registerDataSource(createMockSource([DATA_STREAM]));

  const page = await newSpecPage({
    components: [IotConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const connector = page.doc.createElement('iot-connector') as CustomHTMLElement<Components.IotConnector>;
  const props: Partial<Components.IotConnector> = {
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

beforeEach(() => {
  resetDataModule();
});

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
      assets: [{ assetId, propertyIds: [propertyId] }],
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
    assets: [{ assetId, propertyIds: [propertyId] }],
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
