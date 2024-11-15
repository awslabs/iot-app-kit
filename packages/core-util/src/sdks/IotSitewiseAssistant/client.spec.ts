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
  },
};
const response3 = {
  output: {
    message: 'assistant response 2',
  },
};

const responseAccessDeniedException = {
  accessDeniedException: {
    name: 'accessDeniedException',
    message: 'message accessDeniedException',
  },
};

const responseInternalFailureException = {
  internalFailureException: {
    name: 'internalFailureException',
    message: 'message internalFailureException',
  },
};

const responseLimitExceededException = {
  limitExceededException: {
    name: 'limitExceededException',
    message: 'message limitExceededException',
  },
};

const responseResourceNotFoundException = {
  resourceNotFoundException: {
    name: 'resourceNotFoundException',
    message: 'message resourceNotFoundException',
  },
};

const responseThrottlingException = {
  throttlingException: {
    name: 'throttlingException',
    message: 'message throttlingException',
  },
};

describe('AssistantClient', () => {
  const conversationId = 'myAssistantConversation';
  const componentId = 'componentId';
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

    client.invoke({
      componentId,
      conversationId,
      utterance: 'customer message',
    });

    expect(mockInvokeAssistant).toBeCalled();
  });

  it('can set RequestHandlers', async () => {
    const mockOnResponse = jest.fn();
    const mockOnComplete = jest.fn();
    const mockOnError = jest.fn();
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

    client.setRequestHandlers(mockOnResponse, mockOnComplete, mockOnError);
    client.invoke({
      componentId,
      conversationId,
      utterance: 'customer message',
    });

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

    client.invoke({
      componentId,
      conversationId,
      utterance: 'customer message',
      context: 'additional context',
    });

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

    client.invoke({
      componentId,
      conversationId,
      utterance: 'customer message',
      context: 'additional context',
    });

    // simulate streaming API latency and partial responses
    await flushPromises(); // move to next tick and return yield

    expect(onComplete).toBeCalled();
  });

  it('call generateSummary and invoke assistant with summary utterance and context', () => {
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
    client.generateSummary({
      componentId,
      conversationId,
      context,
      utterance: summaryUtterance,
    });

    expect(mockInvokeAssistant).toBeCalledWith(
      expect.objectContaining({
        conversationId,
        message: `given this context: ${context} ${summaryUtterance}`,
      })
    );
  });

  it('handle error when invoke assistant call fails', async () => {
    const onError = jest.fn();
    const mockInvokeAssistant = jest
      .fn()
      .mockRejectedValue(new Error('assistant 5xx error'));
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
      defaultContext: '',
      onError,
    });

    client.invoke({
      componentId,
      conversationId,
      utterance: 'customer message',
      context: 'additional context',
    });

    await flushPromises(); // move to next tick and return yield

    expect(onError).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({
        message: 'assistant 5xx error',
      })
    );
  });

  it('handle invoke assistant with accessDeniedException as response', async () => {
    const onError = jest.fn();
    const mockInvokeAssistant = jest
      .fn()
      .mockResolvedValue({ body: [responseAccessDeniedException] });
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
      defaultContext: '',
      onError,
    });

    client.invoke({
      componentId,
      conversationId,
      utterance: 'customer message',
      context: 'additional context',
    });

    await flushPromises(); // move to next tick and return yield

    expect(onError).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({
        name: responseAccessDeniedException.accessDeniedException.name,
        message: responseAccessDeniedException.accessDeniedException.message,
      })
    );
  });

  it('handle invoke assistant with internalFailureException as response', async () => {
    const onError = jest.fn();
    const mockInvokeAssistant = jest
      .fn()
      .mockResolvedValue({ body: [responseInternalFailureException] });
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
      defaultContext: '',
      onError,
    });

    client.invoke({
      componentId,
      conversationId,
      utterance: 'customer message',
      context: 'additional context',
    });

    await flushPromises(); // move to next tick and return yield

    expect(onError).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({
        name: responseInternalFailureException.internalFailureException.name,
        message:
          responseInternalFailureException.internalFailureException.message,
      })
    );
  });

  it('handle invoke assistant with limitExceededException as response', async () => {
    const onError = jest.fn();
    const mockInvokeAssistant = jest
      .fn()
      .mockResolvedValue({ body: [responseLimitExceededException] });
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
      defaultContext: '',
      onError,
    });

    client.invoke({
      componentId,
      conversationId,
      utterance: 'customer message',
      context: 'additional context',
    });

    await flushPromises(); // move to next tick and return yield

    expect(onError).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({
        name: responseLimitExceededException.limitExceededException.name,
        message: responseLimitExceededException.limitExceededException.message,
      })
    );
  });

  it('handle invoke assistant with resourceNotFoundException as response', async () => {
    const onError = jest.fn();
    const mockInvokeAssistant = jest
      .fn()
      .mockResolvedValue({ body: [responseResourceNotFoundException] });
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
      defaultContext: '',
      onError,
    });

    client.invoke({
      componentId,
      conversationId,
      utterance: 'customer message',
      context: 'additional context',
    });

    await flushPromises(); // move to next tick and return yield

    expect(onError).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({
        name: responseResourceNotFoundException.resourceNotFoundException.name,
        message:
          responseResourceNotFoundException.resourceNotFoundException.message,
      })
    );
  });

  it('handle invoke assistant with throttlingException as response', async () => {
    const onError = jest.fn();
    const mockInvokeAssistant = jest
      .fn()
      .mockResolvedValue({ body: [responseThrottlingException] });
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
      defaultContext: '',
      onError,
    });

    client.invoke({
      componentId,
      conversationId,
      utterance: 'customer message',
      context: 'additional context',
    });

    await flushPromises(); // move to next tick and return yield

    expect(onError).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({
        name: responseThrottlingException.throttlingException.name,
        message: responseThrottlingException.throttlingException.message,
      })
    );
  });
});