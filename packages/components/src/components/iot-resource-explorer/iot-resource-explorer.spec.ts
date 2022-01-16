import { initialize } from '@iot-app-kit/core';
import { MockSiteWiseAssetModule, MockSiteWiseAssetsReplayData } from '@iot-app-kit/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { IotResourceExplorer } from './iot-resource-explorer';
import { Components } from '../../components.d';
import { CustomHTMLElement } from '../../testing/types';
import { update } from '../../testing/update';
import { ResourceExplorerQuery } from './types';

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

const appKitInit = initialize({ awsCredentials, awsRegion: 'us-east-1' });

const resourceExplorerSpec = async (injectProps: any) => {
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
    ...injectProps,
    appKit: appKitInit,
    query,
  };
  update(resourceExplorer, props);
  page.body.appendChild(resourceExplorer);

  await page.waitForChanges();

  return { resourceExplorer };
};

it('renders', async () => {
  const { resourceExplorer } = await resourceExplorerSpec({});
  const elements = resourceExplorer.querySelectorAll('sitewise-resource-explorer');
  expect(elements.length).toBe(1);
});

it('renders with custom copy', async () => {
  const { resourceExplorer } = await resourceExplorerSpec({
    loadingText: 'loading...',
  });
  const element = resourceExplorer.querySelector('sitewise-resource-explorer');
  expect(element!.getAttribute('loadingText')).toBe('loading...');
});

it('renders without filter', async () => {
  const { resourceExplorer } = await resourceExplorerSpec({
    filterEnabled: false,
  });
  const element = resourceExplorer.querySelector('sitewise-resource-explorer');
  expect(element!.getAttribute('filterEnabled')).toBe(null);
});

it('renders without sorting', async () => {
  const { resourceExplorer } = await resourceExplorerSpec({
    sortingEnabled: false,
  });
  const element = resourceExplorer.querySelector('sitewise-resource-explorer');
  expect(element!.getAttribute('sortingEnabled')).toBe(null);
});

it('renders without pagination', async () => {
  const { resourceExplorer } = await resourceExplorerSpec({
    paginationEnabled: false,
  });
  const element = resourceExplorer.querySelector('sitewise-resource-explorer');
  expect(element!.getAttribute('paginationEnabled')).toBe(null);
});
