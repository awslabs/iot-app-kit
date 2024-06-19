import { IoTSitewiseAssistantClient } from './client';
import { FakeInvokeAssistant } from './mockedResponse';

function flushPromises() {
  return new Promise(jest.requireActual('timers').setImmediate);
}

describe('AssistantClient', () => {
  const conversationId = 'myAssistantConversation';
  beforeEach(() => jest.clearAllMocks());

  it('createAssistantClient return a new instance', () => {
    const client = new IoTSitewiseAssistantClient({
      requestFns: {
        invokeAssistant: FakeInvokeAssistant,
      },
      defaultContext: '',
      onResponse: () => {},
      onComplete: () => {},
    });

    expect(client).toBeDefined();
  });

  it('can set RequestFunctions aka AWS SDK clients', () => {
    const mockInvokeAssistant = jest
      .fn()
      .mockResolvedValue({ StreamResponse: [] });
    const client = new IoTSitewiseAssistantClient({
      requestFns: {
        invokeAssistant: FakeInvokeAssistant,
      },
      defaultContext: '',
      onResponse: () => {},
      onComplete: () => {},
    });

    client.setRequestFns({
      invokeAssistant: mockInvokeAssistant,
    });

    client.invoke(conversationId, 'customer message');

    expect(mockInvokeAssistant).toBeCalled();
  });

  it('call invoke and return all responses', async () => {
    const onResponse = jest.fn();
    const client = new IoTSitewiseAssistantClient({
      requestFns: {
        invokeAssistant: FakeInvokeAssistant,
      },
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
      requestFns: {
        invokeAssistant: FakeInvokeAssistant,
      },
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
});
