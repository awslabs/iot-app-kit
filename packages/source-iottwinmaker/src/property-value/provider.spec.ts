import { TwinMakerPropertyValueDataProvider } from './provider';
import { GetPropertyValueCommandOutput } from '@aws-sdk/client-iottwinmaker';
import { MINUTE_IN_MS } from '../common/timeConstants';

import flushPromises from 'flush-promises';
import { QueryClient } from '@tanstack/query-core';
import { createMockTwinMakerSDK } from '../__mocks__/iottwinmakerSDK';

const getPropertyValue = jest.fn();
const tmClient = createMockTwinMakerSDK({ getPropertyValue });
const queryClient = new QueryClient();
const mockEntityRef1 = {
  entityId: 'entity-1',
  componentName: 'comp-1',
  propertyName: 'prop-1',
};

it('should subscribes, updates, and unsubscribes to property value data', async () => {
  const refreshRate = MINUTE_IN_MS;
  const mockAPIResponse: GetPropertyValueCommandOutput = {
    $metadata: {},
    propertyValues: {
      [mockEntityRef1.propertyName]: {
        propertyReference: mockEntityRef1,
        propertyValue: {
          stringValue: 'result-2',
        },
      },
    },
  };
  getPropertyValue.mockResolvedValue(mockAPIResponse);

  const provider = new TwinMakerPropertyValueDataProvider(
    queryClient,
    tmClient,
    {
      queries: [
        {
          workspaceId: 'ws-1',
          entityId: mockEntityRef1.entityId,
          componentName: mockEntityRef1.componentName,
          properties: [{ propertyName: mockEntityRef1.propertyName }],
        },
      ],
      request: {
        settings: { refreshRate },
      },
    }
  );

  const subscribeCallback = jest.fn();

  // subscribe
  provider.subscribe({ next: subscribeCallback });

  await flushPromises();

  expect(subscribeCallback).toBeCalledWith([
    {
      dataStreams: [
        {
          data: [{ y: 'result-2' }],
          dataType: 'STRING',
          meta: mockEntityRef1,
        },
      ],
    },
  ]);

  // unsubscribe
  provider.unsubscribe();
});
