import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import { useAssistant } from './useAssistant';
import { renderHook, waitFor, act } from '@testing-library/react';
import type { MessageParser } from './messageParser';
import type { IoTSiteWise } from '@amzn/iot-black-pearl-internal-v3';
import { MessageType } from './types';

const response1 = {
  trace: {
    traceId: 'step1',
    text: 'contains information about the intermediate step',
  },
};
const response2 = {
  output: {
    message: 'assistant response',
  },
};

const responseAccessDeniedException = {
  accessDeniedException: {
    name: 'accessDeniedException',
    message: 'message accessDeniedException',
  },
};

describe('useAssistant', () => {
  const conversationId = 'myAssistantConversation';
  const componentId = 'componentId';
  const mockInvokeAssistant = jest
    .fn()
    .mockResolvedValue({ body: [response1, response2] });
  const client = new IoTSitewiseAssistantClient({
    iotSiteWiseClient: {
      invokeAssistant: mockInvokeAssistant,
    } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
    defaultContext: '',
  });

  beforeEach(() => jest.clearAllMocks());

  it('should provide a default implementation for messageParser', async () => {
    const { result } = renderHook(() =>
      useAssistant({
        assistantClient: client,
      })
    );

    act(() => {
      result.current.invokeAssistant({
        componentId,
        conversationId,
        utterance: 'customer message',
        target: 'widget',
      });
    });

    await waitFor(() => {
      expect(result.current.messages.length).toBe(2);
    });
  });

  it('should throw error if assistantClient is not defined when invokeAssistant is called', async () => {
    const { result } = renderHook(() => useAssistant({}));

    expect(() => {
      result.current.invokeAssistant({
        componentId,
        conversationId,
        utterance: 'customer message',
        target: 'dashboard',
      });
    }).toThrowError('assistantClient is not defined');
  });

  it('should throw error if assistantClient is not defined when invokeAssistant is called', async () => {
    const { result } = renderHook(() => useAssistant({}));

    expect(() => {
      result.current.generateSummary({
        componentId,
        conversationId,
        utterance: 'customer message',
        target: 'dashboard',
      });
    }).toThrowError('assistantClient is not defined');
  });

  it('should allow a custom messageParser ', async () => {
    const getText = jest.fn();
    const getPartialResponse = jest.fn();
    const mockedParser = {
      getText,
      getPartialResponse,
    };
    const newClient = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
      defaultContext: '',
      onResponse: jest.fn(),
      onComplete: jest.fn(),
    });
    const { result } = renderHook(() =>
      useAssistant({
        assistantClient: newClient,
        messageParser: mockedParser as unknown as MessageParser,
      })
    );

    act(() => {
      result.current.invokeAssistant({
        componentId,
        conversationId,
        utterance: 'customer message',
        target: 'widget',
      });
    });

    await waitFor(() => {
      expect(getText).toBeCalled();
      expect(getPartialResponse).toBeCalled();
    });
  });

  it('should be able to setMessages to the assistant state', async () => {
    const newClient = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
      defaultContext: '',
    });
    const { result } = renderHook(() =>
      useAssistant({
        assistantClient: newClient,
      })
    );

    const expectedContent =
      'Hello, I am your dashboard assistant, please ask me anything about your dashboard.';
    act(() => {
      result.current.setMessages([
        {
          content: expectedContent,
          sender: 'assistant',
          type: MessageType.TEXT,
          id: 'messageId',
          loading: false,
        },
      ]);
    });

    await waitFor(() => {
      const [first] = result.current.messages;
      expect(first.content).toBe(expectedContent);
    });
  });

  it('should invoke Assistant', async () => {
    const newClient = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
      defaultContext: '',
    });
    const { result } = renderHook(() =>
      useAssistant({
        assistantClient: newClient,
      })
    );

    act(() => {
      result.current.invokeAssistant({
        componentId,
        conversationId,
        utterance: 'customer message',
        target: 'widget',
      });
    });

    await waitFor(() => {
      expect(mockInvokeAssistant).toBeCalledWith({
        conversationId,
        enableTrace: true,
        message: ` customer message`,
      });
    });
  });

  it('should generate Summary', async () => {
    const summaryUtterance = 'generate a summary';
    const context = '{"assetId": "assetId1"}';
    const { result } = renderHook(() =>
      useAssistant({
        assistantClient: client,
      })
    );

    act(() => {
      result.current.generateSummary({
        componentId,
        conversationId,
        utterance: summaryUtterance,
        context,
        target: 'widget',
      });
    });

    await waitFor(() => {
      expect(mockInvokeAssistant).toBeCalledWith({
        conversationId,
        enableTrace: true,
        message: `given this context: ${context} ${summaryUtterance}`,
      });
    });
  });

  it('handle invoke assistant with internalFailureException as response', async () => {
    const mockInvokeAssistant = jest
      .fn()
      .mockResolvedValue({ body: [responseAccessDeniedException] });

    const client = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
      defaultContext: '',
    });

    const { result } = renderHook(() =>
      useAssistant({
        assistantClient: client,
      })
    );

    act(() => {
      result.current.invokeAssistant({
        componentId,
        conversationId,
        utterance: 'customer message',
        target: 'widget',
      });
    });

    await waitFor(() => {
      expect(result.current.messages[2]).toEqual(
        expect.objectContaining({
          id: expect.anything(),
          loading: false,
          content: responseAccessDeniedException.accessDeniedException.message,
          sender: 'assistant',
          type: MessageType.ERROR,
          payload: expect.anything(),
        })
      );
    });
  });

  it('should clear component action when clearActions is called', async () => {
    const newClient = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
      defaultContext: '',
    });
    const { result } = renderHook(() =>
      useAssistant({
        assistantClient: newClient,
      })
    );

    act(() => {
      result.current.startAction({
        componentId: 'componentId1',
        target: 'dashboard',
        action: 'summarize',
      });
      result.current.startAction({
        componentId: 'componentId2',
        target: 'dashboard',
        action: 'summarize',
      });
    });

    act(() => {
      result.current.clearActions('componentId1');
    });

    await waitFor(() => {
      expect(result.current.actions).toEqual({
        componentId2: {
          target: 'dashboard',
          action: 'summarize',
        },
      });
    });
  });

  it('should clear state when clearAll is called', async () => {
    const newClient = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
      defaultContext: '',
    });
    const { result } = renderHook(() =>
      useAssistant({
        assistantClient: newClient,
      })
    );

    act(() => {
      result.current.setMessages([
        {
          content: 'Any content',
          sender: 'assistant',
          type: MessageType.TEXT,
          id: 'messageId',
          loading: false,
        },
      ]);
      result.current.startAction({
        componentId: 'componentId',
        target: 'dashboard',
        action: 'summarize',
      });
    });

    act(() => {
      result.current.clearAll();
    });

    await waitFor(() => {
      expect(result.current.messages.length).toEqual(0);
      expect(result.current.actions).toEqual({});
    });
  });
});
