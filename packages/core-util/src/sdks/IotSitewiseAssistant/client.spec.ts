import { IoTSitewiseAssistantClient } from './client';
import { MockInvokeAssistant } from './mockedResponse';

function flushPromises() {
  return new Promise(jest.requireActual('timers').setImmediate);
}

describe('AssistantClient', () => {
  const conversationId = 'myAssistantConversation';
  beforeEach(() => jest.clearAllMocks());

  it('createAssistantClient return a new instance', () => {
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: MockInvokeAssistant,
      },
      assistantId: 'myAssistantID',
      defaultContext: '',
      onResponse: () => {},
      onComplete: () => {},
    });

    expect(client).toBeDefined();
  });

  it('can set a new assistant name', () => {
    const mockInvokeAssistant = jest
      .fn()
      .mockResolvedValue({ StreamResponse: [] });
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      },
      assistantId: 'myAssistantID',
      defaultContext: '',
      onResponse: () => {},
      onComplete: () => {},
    });

    client.setAssistantId('newAssistantId');
    client.invoke(conversationId, 'customer message');

    expect(mockInvokeAssistant).toBeCalledWith(
      expect.objectContaining({
        assistantId: 'newAssistantId',
        conversationId,
        enabledTrace: true,
        invocationInputs: {
          messages: [{ text: expect.any(String) }],
          metadata: { context: expect.any(String) },
        },
      })
    );
  });

  it('can set RequestFunctions aka AWS SDK clients', () => {
    const mockInvokeAssistant = jest
      .fn()
      .mockResolvedValue({ StreamResponse: [] });
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: MockInvokeAssistant,
      },
      assistantId: 'myAssistantID',
      defaultContext: '',
      onResponse: () => {},
      onComplete: () => {},
    });

    client.setIotSiteWiseClient({
      invokeAssistant: mockInvokeAssistant,
    });

    client.invoke(conversationId, 'customer message');

    expect(mockInvokeAssistant).toBeCalled();
  });

  it('can set RequestHandlers aka AWS SDK clients', async () => {
    const mockOnResponse = jest.fn();
    const mockOnComplete = jest.fn();
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: MockInvokeAssistant,
      },
      assistantId: 'myAssistantID',
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
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: MockInvokeAssistant,
      },
      assistantId: 'myAssistantID',
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
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: MockInvokeAssistant,
      },
      assistantId: 'myAssistantID',
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
      .mockResolvedValue({ StreamResponse: [] });
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      },
      assistantId: 'myAssistantID',
      defaultContext: '',
      onResponse: () => {},
      onComplete: () => {},
    });

    const summaryUtterance = 'generate a summary';
    const context = `[{"assetId": "assetId1", "properties": ["propertyId1"]}]`;
    client.generateSummary(conversationId, context, summaryUtterance);

    expect(mockInvokeAssistant).toBeCalledWith(
      expect.objectContaining({
        assistantId: 'myAssistantID',
        conversationId,
        enabledTrace: true,
        invocationInputs: {
          messages: [{ text: summaryUtterance }],
          metadata: {
            context,
          },
        },
      })
    );
  });
});
