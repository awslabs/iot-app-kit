import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import { useAssistant } from './useAssistant';
import { renderHook, waitFor, act } from '@testing-library/react';
import type { MessageParser } from './messageParser';
import StateManager from './stateManager';
import { MockInvokeAssistant } from '../../__mocks__/assistantMockedResponse';

describe('useAssistant', () => {
  const conversationId = 'myAssistantConversation';
  const client = new IoTSitewiseAssistantClient({
    requestFns: {
      invokeAssistant: MockInvokeAssistant,
    },
    assistantName: 'myAssistant',
    defaultContext: '',
  });

  beforeEach(() => jest.clearAllMocks());

  it('should provide a default implementation for ', async () => {
    const { result } = renderHook(() =>
      useAssistant({
        assistantClient: client,
      })
    );

    act(() => {
      result.current.invokeAssistant(conversationId, 'customer message');
    });

    await waitFor(() => {
      expect(result.current.messages.length).toBe(1);
    });
  });

  it('should allow a custom messageParser ', async () => {
    const mockedParser = jest.fn();
    const newClient = new IoTSitewiseAssistantClient({
      requestFns: {
        invokeAssistant: MockInvokeAssistant,
      },
      assistantName: 'myAssistant',
      defaultContext: '',
      onResponse: () => mockedParser(),
    });
    const { result } = renderHook(() =>
      useAssistant({
        assistantClient: newClient,
        messageParser: {
          stateManager: null,
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
        stateManager: new StateManager(mockedSetState, jest.fn()),
      })
    );

    await act(() => {
      result.current.invokeAssistant(conversationId, 'customer message');
    });

    await waitFor(() => {
      expect(mockedSetState).toBeCalled();
    });
  });

  it('should invoke Assistant', async () => {
    const mockedInvokeAssistant = jest
      .fn()
      .mockImplementation(MockInvokeAssistant);
    const newClient = new IoTSitewiseAssistantClient({
      requestFns: {
        invokeAssistant: mockedInvokeAssistant,
      },
      assistantName: 'myAssistant',
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
      expect(mockedInvokeAssistant).toBeCalled();
    });
  });

  it('should generate Summary', async () => {
    const summaryUtterance = 'generate a summary';
    const summaryInstructions = 'some instructions';
    const mockedInvokeAssistant = jest
      .fn()
      .mockImplementation(MockInvokeAssistant);
    const newClient = new IoTSitewiseAssistantClient({
      requestFns: {
        invokeAssistant: mockedInvokeAssistant,
      },
      assistantName: 'myAssistant',
      defaultContext: '',
    });
    const { result } = renderHook(() =>
      useAssistant({
        assistantClient: newClient,
      })
    );

    await act(() => {
      result.current.generateSummary(
        conversationId,
        [],
        summaryUtterance,
        summaryInstructions
      );
    });

    await waitFor(() => {
      expect(mockedInvokeAssistant).toBeCalledWith({
        conversationId,
        assistantName: 'myAssistant',
        context: summaryInstructions,
        message: {
          chatMessage: [{ text: summaryUtterance }],
        },
      });
    });
  });
});
