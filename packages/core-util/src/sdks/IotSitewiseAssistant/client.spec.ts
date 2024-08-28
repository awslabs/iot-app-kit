import type { IoTSiteWise } from '@amzn/iot-black-pearl-internal-v3';
import { IoTSitewiseAssistantClient } from './client';

jest.mock('@amzn/iot-black-pearl-internal-v3');

function flushPromises() {
  return new Promise(jest.requireActual('timers').setImmediate);
}

const response1 = {
  trace: {
    traceId: 'trace1',
    text: 'contains information about the intermediate trace',
  },
};
const response2 = {
  trace: {
    traceId: 'trace2',
    text: 'contains information about the intermediate trace part 2',
  }
};
const response3 = {
  output: {
    message: 'assistant response 2',
  },
};

describe('AssistantClient', () => {
  const conversationId = 'myAssistantConversation';
  beforeEach(() => jest.clearAllMocks());

  it('createAssistantClient return a new instance', () => {
    const mockInvokeAssistant = jest.fn().mockResolvedValue({ body: [] });
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
      defaultContext: '',
      onResponse: () => {},
      onComplete: () => {},
    });

    expect(client).toBeDefined();
  });

  it('can set iotSiteWiseClient', () => {
    const mockInvokeAssistant = jest.fn().mockResolvedValue({ body: [] });
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
      defaultContext: '',
      onResponse: () => {},
      onComplete: () => {},
    });

    client.setIotSiteWiseClient({
      invokeAssistant: mockInvokeAssistant,
    } satisfies Pick<IoTSiteWise, 'invokeAssistant'>);

    client.invoke(conversationId, 'customer message');

    expect(mockInvokeAssistant).toBeCalled();
  });

  it('can set RequestHandlers', async () => {
    const mockOnResponse = jest.fn();
    const mockOnComplete = jest.fn();
    const mockInvokeAssistant = jest
      .fn()
      .mockResolvedValue({ body: [response2, response3] });
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
      defaultContext: '',
      onResponse: () => {},
      onComplete: () => {},
    });

    client.setRequestHandlers(mockOnResponse, mockOnComplete);
    client.invoke(conversationId, 'customer message');

    await flushPromises();

    expect(mockOnResponse).toBeCalled();
    expect(mockOnComplete).toBeCalled();
  });

  it('call invoke and return all responses', async () => {
    const onResponse = jest.fn();
    const mockInvokeAssistant = jest
      .fn()
      .mockResolvedValue({ body: [response1, response2] });
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
      defaultContext: '',
      onResponse,
      onComplete: () => {},
    });
    expect(client).toBeDefined();

    client.invoke(conversationId, 'customer message', 'additional context');

    // simulate streaming API latency and partial responses
    await flushPromises(); // move to next tick and return yield

    expect(onResponse).toBeCalledTimes(2);
  });

  it('call invoke and listen all responses have completed', async () => {
    const onComplete = jest.fn();
    const mockInvokeAssistant = jest
      .fn()
      .mockResolvedValue({ body: [response3] });
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
      defaultContext: '',
      onResponse: () => {},
      onComplete,
    });
    expect(client).toBeDefined();

    client.invoke(conversationId, 'customer message', 'additional context');

    // simulate streaming API latency and partial responses
    await flushPromises(); // move to next tick and return yield

    expect(onComplete).toBeCalled();
  });

  it('call generateSummary and invoke assistant with summary utterance and context', async () => {
    const mockInvokeAssistant = jest
      .fn()
      .mockResolvedValue({ body: [response3] });
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
      defaultContext: '',
      onResponse: () => {},
      onComplete: () => {},
    });

    const summaryUtterance = 'generate a summary';
    const context = `[{"assetId": "assetId1", "properties": ["propertyId1"]}]`;
    client.generateSummary(conversationId, context, summaryUtterance);

    expect(mockInvokeAssistant).toBeCalledWith(
      expect.objectContaining({
        conversationId,
        message: `given this context: " ${context}" ${summaryUtterance}`,
      })
    );
  });
});
