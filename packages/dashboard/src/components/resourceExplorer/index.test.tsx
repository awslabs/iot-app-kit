import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createMockSiteWiseSDK, createMockIoTEventsSDK, initialize } from '@iot-app-kit/source-iotsitewise';
import {
  ListAssetsCommandInput,
  ListAssetsResponse,
  ListAssociatedAssetsCommandInput,
  ListAssociatedAssetsResponse,
} from '@aws-sdk/client-iotsitewise';
import { ResourceExplorer } from './index';
import { mockListAssets, mockListAssociatedAssets } from '../../../stories/IotDashboard/mockData';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { act } from 'react-dom/test-utils';
import { DefaultDashboardMessages } from '~/messages';

global.structuredClone = (val: unknown) => JSON.parse(JSON.stringify(val));

const createDefaultClient = () =>
  createMockSiteWiseSDK({
    listAssets: mockListAssets as unknown as (input: ListAssetsCommandInput) => Promise<ListAssetsResponse>,
    listAssociatedAssets: mockListAssociatedAssets as unknown as (
      input: ListAssociatedAssetsCommandInput
    ) => Promise<ListAssociatedAssetsResponse>,
  });

const elSelector = '.iot-resource-explorer';

const createTestContext = async (iotSiteWiseClient: IoTSiteWiseClient = createDefaultClient()) => {
  const { query } = initialize({
    iotSiteWiseClient: iotSiteWiseClient,
    iotEventsClient: createMockIoTEventsSDK(),
  });

  const container = document.createElement('div');
  document.body.appendChild(container);

  act(() => {
    ReactDOM.render(
      <div>
        <ResourceExplorer treeQuery={query.assetTree.fromRoot()} messageOverrides={DefaultDashboardMessages} />
      </div>,
      container
    );
  });

  return document;
};

describe('ResourceExplorer', () => {
  it('should render', async () => {
    const document = await createTestContext();
    const elements = document.querySelectorAll(elSelector);
    expect(elements.length).toBe(1);
  });
});
