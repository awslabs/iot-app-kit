import { createMockSiteWiseSDK, initialize, IoTAppKitInitInputs } from '@iot-app-kit/core';
import { newSpecPage } from '@stencil/core/testing';
import { IotResourceExplorer } from './iot-resource-explorer';
import { Components } from '../../components.d';
import { CustomHTMLElement } from '../../testing/types';
import { update } from '../../testing/update';
import { ResourceExplorerQuery } from './types';
import flushPromises from 'flush-promises';
import { mocklistAssetsResponse } from '../../testing/mocks/data/listAssetsResponse';

const resourceExplorerSpec = async (
  propOverrides: Partial<Components.IotResourceExplorer>,
  appKitInitOverrides: Partial<IoTAppKitInitInputs> = {}
) => {
  const appKitSession = initialize({ registerDataSources: false, ...appKitInitOverrides }).session();

  const page = await newSpecPage({
    components: [IotResourceExplorer],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const query: ResourceExplorerQuery = { source: 'site-wise', rootAssetId: undefined };
  const resourceExplorer = page.doc.createElement(
    'iot-resource-explorer'
  ) as CustomHTMLElement<Components.IotResourceExplorer>;
  const props: Partial<Components.IotResourceExplorer> = {
    appKitSession,
    query,
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
    {
      iotSiteWiseClient: createMockSiteWiseSDK({
        listAssets: () => Promise.resolve(mocklistAssetsResponse),
      }),
    }
  );
  const elements = resourceExplorer.querySelectorAll('sitewise-resource-explorer');
  expect(elements.length).toBe(1);
});

it('renders with custom copy', async () => {
  const { resourceExplorer } = await resourceExplorerSpec(
    {
      loadingText: 'loading...',
    },
    {
      iotSiteWiseClient: createMockSiteWiseSDK({
        listAssets: () => Promise.resolve(mocklistAssetsResponse),
      }),
    }
  );
  const element = resourceExplorer.querySelector('sitewise-resource-explorer');
  expect(element!.getAttribute('loadingText')).toBe('loading...');
});

it('renders without filter', async () => {
  const { resourceExplorer } = await resourceExplorerSpec(
    {
      filterEnabled: false,
    },
    {
      iotSiteWiseClient: createMockSiteWiseSDK({
        listAssets: () => Promise.resolve(mocklistAssetsResponse),
      }),
    }
  );
  const element = resourceExplorer.querySelector('sitewise-resource-explorer');
  expect(element!.getAttribute('filterEnabled')).toBe(null);
});

it('renders without sorting', async () => {
  const { resourceExplorer } = await resourceExplorerSpec(
    {
      sortingEnabled: false,
    },
    {
      iotSiteWiseClient: createMockSiteWiseSDK({
        listAssets: () => Promise.resolve(mocklistAssetsResponse),
      }),
    }
  );
  const element = resourceExplorer.querySelector('sitewise-resource-explorer');
  expect(element!.getAttribute('sortingEnabled')).toBe(null);
});

it('renders without pagination', async () => {
  const { resourceExplorer } = await resourceExplorerSpec(
    {
      paginationEnabled: false,
    },
    {
      iotSiteWiseClient: createMockSiteWiseSDK({
        listAssets: () => Promise.resolve(mocklistAssetsResponse),
      }),
    }
  );
  const element = resourceExplorer.querySelector('sitewise-resource-explorer');
  expect(element!.getAttribute('paginationEnabled')).toBe(null);
});
