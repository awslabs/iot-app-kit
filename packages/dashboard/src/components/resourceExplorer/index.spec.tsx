import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createMockSiteWiseSDK, createMockIoTEventsSDK, initialize } from '@iot-app-kit/source-iotsitewise';
import { IotResourceExplorer, IotResourceExplorerProps } from './index';
import { mocklistAssetsResponse } from './mocks';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { act } from 'react-dom/test-utils';

const createDefaultClient = () =>
  createMockSiteWiseSDK({
    listAssets: () => Promise.resolve(mocklistAssetsResponse),
  });

// (input: ListAssetsCommandInput) => Promise<ListAssetsResponse>

const elSelector = '.iot-resource-explorer';

const createTestContext = async (
  propOverrides: Partial<IotResourceExplorerProps>,
  iotSiteWiseClient: IoTSiteWiseClient = createDefaultClient()
) => {
  const { query } = initialize({
    iotSiteWiseClient: iotSiteWiseClient,
    iotEventsClient: createMockIoTEventsSDK(),
  });

  const container = document.createElement('div');
  document.body.appendChild(container);

  act(() => {
    ReactDOM.render(
      <div>
        <IotResourceExplorer query={query.assetTree.fromRoot()} {...propOverrides} />
      </div>,
      container
    );
  });

  return document;
};

describe('IotResourceExplorer', () => {
  it('should render', async () => {
    const document = await createTestContext({});
    const elements = document.querySelectorAll(elSelector);
    expect(elements.length).toBe(1);
  });
});

it('renders with custom loadingText', async () => {
  const emptyText = 'Loading...';
  const document = await createTestContext({ loadingText: emptyText });
  const element = document.querySelector(elSelector);
  expect(element!.getAttribute('loadingText')).toBe(emptyText);
});

it('renders without filter', async () => {
  const document = await createTestContext({ filterEnabled: false });
  const element = document.querySelector(elSelector);
  expect(element!.getAttribute('filterEnabled')).toBe(null);
});

it('renders without sorting', async () => {
  const document = await createTestContext({ sortingEnabled: false });
  const element = document.querySelector(elSelector);
  expect(element!.getAttribute('sortingEnabled')).toBe(null);
});

it('renders without pagination', async () => {
  const document = await createTestContext({ paginationEnabled: false });
  const element = document.querySelector(elSelector);
  expect(element!.getAttribute('paginationEnabled')).toBe(null);
});
