import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import { useAssistant } from './useAssistant';
import { renderHook, waitFor, act } from '@testing-library/react';
import type { MessageParser } from './messageParser';
import { StateManager } from './stateManager';
import type { IoTSiteWise } from '@amzn/iot-black-pearl-internal-v3';
import useDataStore from '../../store';
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
  const mockInvokeAssistant = jest
    .fn()
    .mockResolvedValue({ body: [response1, response2] });
  const client = new IoTSitewiseAssistantClient({
    iotSiteWiseClient: {
      invokeAssistant: mockInvokeAssistant,
    } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
    defaultContext: '',
  });
  const mockGetState = jest
    .fn()
    .mockImplementation(() => () => ({ messages: [] }));

  beforeEach(() => jest.clearAllMocks());

  it('should provide a default implementation for messageParser and state manager', async () => {
    const { result } = renderHook(() =>
      useAssistant({
        assistantClient: client,
      })
    );

    act(() => {
      result.current.invokeAssistant(conversationId, 'customer message');
    });

    await waitFor(() => {
      expect(result.current.messages.length).toBe(2);
    });
  });

  it('should clear assistant state when invokeAssistant is called', async () => {
    const storeState = useDataStore.getState();
    const spied = jest.spyOn(storeState, 'clearAssistantState');

    const { result } = renderHook(() =>
      useAssistant({
        assistantClient: client,
      })
    );

    act(() => {
      result.current.invokeAssistant(conversationId, 'customer message');
    });

    await waitFor(() => {
      expect(spied).toHaveBeenCalled();
    });
  });

  it('should clear assistant state when generateSummary is called', async () => {
    const storeState = useDataStore.getState();
    const spied = jest.spyOn(storeState, 'clearAssistantState');

    const { result } = renderHook(() =>
      useAssistant({
        assistantClient: client,
      })
    );

    act(() => {
      result.current.generateSummary(conversationId, 'customer message');
    });

    await waitFor(() => {
      expect(spied).toHaveBeenCalled();
    });
  });

  it('should allow a custom messageParser ', async () => {
    const mockedParser = jest.fn();
    const newClient = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockInvokeAssistant,
      } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
      defaultContext: '',
      onResponse: () => mockedParser(),
    });
    const { result } = renderHook(() =>
      useAssistant({
        assistantClient: newClient,
        messageParser: {
          stateManager: new StateManager(jest.fn(), mockGetState, jest.fn()),
          setStateManager: () => {},
          parse: mockedParser,
        } as unknown as MessageParser,
      })
    );

    await act(() => {
      result.current.invokeAssistant(conversationId, 'customer message');
    });

    await waitFor(() => {
      expect(mockedParser).toBeCalled();
    });
  });

  it('should allow a custom state Manager', async () => {
    const mockedSetState = jest.fn();
    const { result } = renderHook(() =>
      useAssistant({
        assistantClient: client,
        stateManager: new StateManager(mockedSetState, mockGetState, jest.fn()),
      })
    );

    await act(() => {
      result.current.invokeAssistant(conversationId, 'customer message');
    });

    await waitFor(() => {
      expect(mockedSetState).toBeCalled();
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
    await act(() => {
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

    await act(() => {
      result.current.invokeAssistant(conversationId, 'customer message');
    });

    await waitFor(() => {
      expect(mockInvokeAssistant).toBeCalledWith({
        conversationId,
        enableTrace: true,
        message: `given this context:  customer message`,
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

    await act(() => {
      result.current.generateSummary(conversationId, context, summaryUtterance);
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
      result.current.invokeAssistant(conversationId, 'customer message');
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
});
