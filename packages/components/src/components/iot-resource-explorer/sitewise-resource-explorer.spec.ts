import { initialize } from '@iot-app-kit/core';
import { MockSiteWiseAssetModule, MockSiteWiseAssetsReplayData } from '@iot-app-kit/core/asset-modules/mocks.spec';
import * as core from '@iot-app-kit/core';
import { newSpecPage } from '@stencil/core/testing';
import { SitewiseResourceExplorer } from './sitewise-resource-explorer';
import { Components } from '../../components.d';
import { CustomHTMLElement } from '../../testing/types';
import { update } from '../../testing/update';

const awsCredentials = {
  accessKeyId: 'accessKeyId',
  secretAccessKey: 'secretAccessKey',
  sessionToken: 'sessionToken',
};

jest.mock('@iot-app-kit/core', () => {
  const originalModule = jest.requireActual('@iot-app-kit/core');

  return {
    ...originalModule,
    getSiteWiseAssetModule: () => {
      return new MockSiteWiseAssetModule(new MockSiteWiseAssetsReplayData());
    },
  };
});

const sitewiseResourceExplorerSpec = async (injectProps: any) => {
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
    ...injectProps,
    query,
  };
  update(sitewiseResourceExplorer, props);
  page.body.appendChild(sitewiseResourceExplorer);

  await page.waitForChanges();

  return { page, sitewiseResourceExplorer };
};

beforeAll(() => {
  initialize({ awsCredentials, awsRegion: 'us-east-1' });
});

it('renders', async () => {
  const { sitewiseResourceExplorer } = await sitewiseResourceExplorerSpec();
  const elements = sitewiseResourceExplorer.querySelectorAll('iot-tree-table');
  expect(elements.length).toBe(1);
});

it('renders with custom copy', async () => {
  const { sitewiseResourceExplorer } = await sitewiseResourceExplorerSpec({
    selectionType: 'single',
    loadingText: 'loading...',
    filterText: {
      placeholder: 'Filter by name',
      empty: 'No assets found.',
      noMatch: `We can't find a match.`,
    },
    empty: {
      header: 'No assets',
      description: `You don't have any asset.`,
    },
  });
  const elements = sitewiseResourceExplorer.querySelectorAll('iot-tree-table');
  expect(elements.length).toBe(1);
});
