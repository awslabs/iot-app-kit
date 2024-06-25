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
      assistantName: 'myAssistant',
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
      requestFns: {
        invokeAssistant: mockInvokeAssistant,
      },
      assistantName: 'myAssistant',
      defaultContext: '',
      onResponse: () => {},
      onComplete: () => {},
    });

    client.setAssistantName('newAssistantName');
    client.invoke(conversationId, 'customer message');

    expect(mockInvokeAssistant).toBeCalledWith(
      expect.objectContaining({
        assistantName: 'newAssistantName',
        context: expect.any(String),
        conversationId,
        message: {
          chatMessage: [{ text: expect.any(String) }],
        },
      })
    );
  });

  it('can set RequestFunctions aka AWS SDK clients', () => {
    const mockInvokeAssistant = jest
      .fn()
      .mockResolvedValue({ StreamResponse: [] });
    const client = new IoTSitewiseAssistantClient({
      requestFns: {
        invokeAssistant: FakeInvokeAssistant,
      },
      assistantName: 'myAssistant',
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
      assistantName: 'myAssistant',
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
      assistantName: 'myAssistant',
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

  it('call endConversation and invoke assistant with endConversation flag as true', async () => {
    const mockInvokeAssistant = jest
      .fn()
      .mockResolvedValue({ StreamResponse: [] });
    const client = new IoTSitewiseAssistantClient({
      requestFns: {
        invokeAssistant: mockInvokeAssistant,
      },
      assistantName: 'myAssistant',
      defaultContext: '',
      onResponse: () => {},
      onComplete: () => {},
    });

    client.endConversation(conversationId);

    expect(mockInvokeAssistant).toBeCalledWith(
      expect.objectContaining({
        assistantName: 'myAssistant',
        context: expect.any(String),
        conversationId,
        endConversation: true,
        message: {
          chatMessage: [{ text: expect.any(String) }],
        },
      })
    );
  });

  it('call generateSummary and invoke assistant with summary utterance and context', async () => {
    const mockInvokeAssistant = jest
      .fn()
      .mockResolvedValue({ StreamResponse: [] });
    const client = new IoTSitewiseAssistantClient({
      requestFns: {
        invokeAssistant: mockInvokeAssistant,
      },
      assistantName: 'myAssistant',
      defaultContext: '',
      onResponse: () => {},
      onComplete: () => {},
    });

    const summaryUtterance = 'generate a summary';
    const summaryInstructions = 'some instructions';
    client.generateSummary(
      conversationId,
      [],
      summaryUtterance,
      summaryInstructions
    );

    expect(mockInvokeAssistant).toBeCalledWith(
      expect.objectContaining({
        assistantName: 'myAssistant',
        context: summaryInstructions,
        conversationId,
        message: {
          chatMessage: [{ text: summaryUtterance }],
        },
      })
    );
  });
});
