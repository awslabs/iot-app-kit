import { createAssistantClient } from './assistantClient';
// TODO: need to mock InvokeAssistant when API is ready

function flushPromises() {
  return new Promise(jest.requireActual('timers').setImmediate);
}

describe('AssistantClient', () => {
  const responsesTotal = 3;

  beforeAll(() => jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  it('createAssistantClient return a new instance', () => {
    const client = createAssistantClient({
      requestFns: {
        invokeAssistant: () => {},
      },
      defaultContext: '',
      onResponse: () => {},
      onComplete: () => {},
    });

    expect(client).toBeDefined();
  });

  it('can set RequestFunctions aka AWS SDK clients', () => {
    const mockInvokeAssistant = jest.fn();
    const client = createAssistantClient({
      requestFns: {
        invokeAssistant: () => {},
      },
      defaultContext: '',
      onResponse: () => {},
      onComplete: () => {},
    });

    client.setRequestFns({
      invokeAssistant: mockInvokeAssistant,
    });

    expect(client).toBeDefined();
  });

  it('call invoke and return all responses', async () => {
    const onResponse = jest.fn();
    const client = createAssistantClient({
      requestFns: {
        invokeAssistant: () => {},
      },
      defaultContext: '',
      onResponse,
      onComplete: () => {},
    });
    expect(client).toBeDefined();

    client.invoke('customer message', { context: 'additional context' });

    // simulate streaming API latency and partial responses
    for (
      let responseIndex = 0;
      responseIndex < responsesTotal;
      responseIndex += 1
    ) {
      jest.runAllTimers(); // run sleep timeout
      await flushPromises(); // move to next tick and return yield
    }

    expect(onResponse).toBeCalledTimes(2);
  });

  it('call invoke and listen all responses have completed', async () => {
    const onComplete = jest.fn();
    const client = createAssistantClient({
      requestFns: {
        invokeAssistant: () => {},
      },
      defaultContext: '',
      onResponse: () => {},
      onComplete,
    });
    expect(client).toBeDefined();

    client.invoke('customer message', { context: 'additional context' });

    // simulate streaming API latency and partial responses
    for (
      let responseIndex = 0;
      responseIndex <= responsesTotal;
      responseIndex += 1
    ) {
      jest.runAllTimers(); // run sleep timeout
      await flushPromises(); // move to next tick and return yield
    }

    expect(onComplete).toBeCalled();
  });
});
