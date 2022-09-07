import { createMockSiteWiseSDK, createMockIoTEventsSDK, initialize } from '@iot-app-kit/source-iotsitewise';
import { newSpecPage } from '@stencil/core/testing';
import { IotResourceExplorer } from './iot-resource-explorer';
import { Components } from '../../components.d';
import { CustomHTMLElement } from '../../testing/types';
import { update } from '../../testing/update';
import flushPromises from 'flush-promises';
import { mocklistAssetsResponse } from '../../testing/mocks/data/listAssetsResponse';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

const resourceExplorerSpec = async (
  propOverrides: Partial<Components.IotResourceExplorer>,
  iotSiteWiseClient: IoTSiteWiseClient
) => {
  const { query } = initialize({
    iotSiteWiseClient: iotSiteWiseClient,
    iotEventsClient: createMockIoTEventsSDK(),
  });
  const page = await newSpecPage({
    components: [IotResourceExplorer],
    html: '<div></div>',
    supportsShadowDom: false,
  });

  const resourceExplorer = page.doc.createElement(
    'iot-resource-explorer'
  ) as CustomHTMLElement<Components.IotResourceExplorer>;

  const props: Partial<Components.IotResourceExplorer> = {
    query: query.assetTree.fromRoot(),
    ...propOverrides,
  };

  update(resourceExplorer, props);
  page.body.appendChild(resourceExplorer);

  await flushPromises();

  await page.waitForChanges();

  return { resourceExplorer };
};

it('renders', async () => {
  const { resourceExplorer } = await resourceExplorerSpec(
    {},
    createMockSiteWiseSDK({
      listAssets: () => Promise.resolve(mocklistAssetsResponse),
    })
  );
  const elements = resourceExplorer.querySelectorAll('iot-tree-table');
  expect(elements.length).toBe(1);
});

it('renders with custom copy', async () => {
  const { resourceExplorer } = await resourceExplorerSpec(
    {
      loadingText: 'loading...',
    },
    createMockSiteWiseSDK({
      listAssets: () => Promise.resolve(mocklistAssetsResponse),
    })
  );
  const element = resourceExplorer.querySelector('iot-tree-table');
  expect(element!.getAttribute('loadingText')).toBe('loading...');
});

it('renders without filter', async () => {
  const { resourceExplorer } = await resourceExplorerSpec(
    {
      filterEnabled: false,
    },
    createMockSiteWiseSDK({
      listAssets: () => Promise.resolve(mocklistAssetsResponse),
    })
  );
  const element = resourceExplorer.querySelector('iot-tree-table');
  expect(element!.getAttribute('filterEnabled')).toBe(null);
});

it('renders without sorting', async () => {
  const { resourceExplorer } = await resourceExplorerSpec(
    {
      sortingEnabled: false,
    },
    createMockSiteWiseSDK({
      listAssets: () => Promise.resolve(mocklistAssetsResponse),
    })
  );
  const element = resourceExplorer.querySelector('iot-tree-table');
  expect(element!.getAttribute('sortingEnabled')).toBe(null);
});

it('renders without pagination', async () => {
  const { resourceExplorer } = await resourceExplorerSpec(
    {
      paginationEnabled: false,
    },
    createMockSiteWiseSDK({
      listAssets: () => Promise.resolve(mocklistAssetsResponse),
    })
  );
  const element = resourceExplorer.querySelector('iot-tree-table');
  expect(element!.getAttribute('paginationEnabled')).toBe(null);
});
