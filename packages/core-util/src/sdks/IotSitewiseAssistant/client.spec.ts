import IoTSiteWise from '@amzn/iot-sitewise-sdk/clients/iotsitewise';
import type {
  FinalResponse,
  InvokeAssistantStep,
} from '@amzn/iot-sitewise-sdk/clients/iotsitewise';
import { IoTSitewiseAssistantClient } from './client';

jest.mock('@amzn/iot-sitewise-sdk/clients/iotsitewise');

function flushPromises() {
  return new Promise(jest.requireActual('timers').setImmediate);
}

const response1 = {
  step: {
    stepId: 'step1',
    rationale: {
      text: 'contains information about the intermediate step',
    },
  } as InvokeAssistantStep,
  finalResponse: {
    message: 'assistant response',
  } as FinalResponse,
};
const response2 = {
  step: {
    stepId: 'step2',
    text: 'contains information about the intermediate step part 2',
  } as InvokeAssistantStep,
  finalResponse: {
    message: 'assistant response 2',
  } as FinalResponse,
};
const response3 = {
  finalResponse: {
    message: 'assistant response 2',
  } as FinalResponse,
};

describe('AssistantClient', () => {
  const conversationId = 'myAssistantConversation';
  beforeEach(() => jest.clearAllMocks());

  it('createAssistantClient return a new instance', () => {
    const mockInvokeAssistant = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue({ body: [] }),
    }));
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } as unknown as IoTSiteWise,
      assistantId: 'myAssistantID',
      defaultContext: '',
      onResponse: () => {},
      onComplete: () => {},
    });

    expect(client).toBeDefined();
  });

  it('can set a new assistant name', () => {
    const mockInvokeAssistant = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue({ body: [] }),
    }));
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } as unknown as IoTSiteWise,
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
          message: expect.any(String),
        },
      })
    );
  });

  it('can set iotSiteWiseClient', () => {
    const mockInvokeAssistant = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue({ body: [] }),
    }));
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } as unknown as IoTSiteWise,
      assistantId: 'myAssistantID',
      defaultContext: '',
      onResponse: () => {},
      onComplete: () => {},
    });

    client.setIotSiteWiseClient({
      invokeAssistant: mockInvokeAssistant,
    } as unknown as IoTSiteWise);

    client.invoke(conversationId, 'customer message');

    expect(mockInvokeAssistant).toBeCalled();
  });

  it('can set RequestHandlers', async () => {
    const mockOnResponse = jest.fn();
    const mockOnComplete = jest.fn();
    const mockInvokeAssistant = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue({ body: [response2, response3] }),
    }));
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } as unknown as IoTSiteWise,
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
    const mockInvokeAssistant = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue({ body: [response1, response2] }),
    }));
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } as unknown as IoTSiteWise,
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
    const mockInvokeAssistant = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue({ body: [response3] }),
    }));
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } as unknown as IoTSiteWise,
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
    const mockInvokeAssistant = jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue({ body: [response3] }),
    }));
    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } as unknown as IoTSiteWise,
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
          message: `given this context: " ${context}" ${summaryUtterance}`,
        },
      })
    );
  });
});
