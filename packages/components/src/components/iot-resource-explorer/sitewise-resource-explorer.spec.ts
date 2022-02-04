import { createMockSiteWiseSDK, initialize, IoTAppKitInitInputs } from '@iot-app-kit/core';
import * as core from '@iot-app-kit/core';
import { newSpecPage } from '@stencil/core/testing';
import { SitewiseResourceExplorer } from './sitewise-resource-explorer';
import { Components } from '../../components.d';
import { CustomHTMLElement } from '../../testing/types';
import { update } from '../../testing/update';
import { SitewiseAssetResource } from './types';
import flushPromises from 'flush-promises';
import { mocklistAssetsResponse } from '../../testing/mocks/data/listAssetsResponse';

const columnDefinitions = [
  {
    sortingField: 'name',
    id: 'name',
    header: 'Asset Name',
    cell: ({ name }: SitewiseAssetResource) => name,
  },
];

const sitewiseResourceExplorerSpec = async (
  propOverrides: Partial<Components.SitewiseResourceExplorer>,
  appKitInitOverrides: Partial<IoTAppKitInitInputs> = {}
) => {
  const appKitSession = initialize({ registerDataSources: false, ...appKitInitOverrides }).session();

  const page = await newSpecPage({
    components: [SitewiseResourceExplorer],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const query: core.SiteWiseAssetTreeQuery = { rootAssetId: undefined };
  const sitewiseResourceExplorer = page.doc.createElement(
    'sitewise-resource-explorer'
  ) as CustomHTMLElement<Components.SitewiseResourceExplorer>;
  const props: Partial<Components.SitewiseResourceExplorer> = {
    appKitSession,
    query,
    columnDefinitions,
    ...propOverrides,
  };
  update(sitewiseResourceExplorer, props);
  page.body.appendChild(sitewiseResourceExplorer);

  await flushPromises();

  await page.waitForChanges();

  return { page, sitewiseResourceExplorer };
};

it('renders', async () => {
  const { sitewiseResourceExplorer, page } = await sitewiseResourceExplorerSpec(
    {},
    {
      iotSiteWiseClient: createMockSiteWiseSDK({
        listAssets: () => Promise.resolve(mocklistAssetsResponse),
      }),
    }
  );

  const elements = sitewiseResourceExplorer.querySelectorAll('iot-tree-table');
  expect(elements.length).toBe(1);
});

it('renders with custom copy', async () => {
  const { sitewiseResourceExplorer } = await sitewiseResourceExplorerSpec(
    {
      selectionType: 'single',
      loadingText: 'loading...',
      filterTexts: {
        placeholder: 'Filter by name',
        empty: 'No assets found.',
        noMatch: `We can't find a match.`,
      },
      empty: {
        header: 'No assets',
        description: `You don't have any asset.`,
      },
    },
    {
      iotSiteWiseClient: createMockSiteWiseSDK({
        listAssets: () => Promise.resolve(mocklistAssetsResponse),
      }),
    }
  );

  const elements = sitewiseResourceExplorer.querySelectorAll('iot-tree-table');
  expect(elements.length).toBe(1);
});
