import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import { useAssistant } from './useAssistant';
import { renderHook, waitFor, act } from '@testing-library/react';
import type { MessageParser } from './messageParser';
import { StateManager } from './stateManager';
import { MockInvokeAssistant } from '../../__mocks__/assistantMockedResponse';

describe('useAssistant', () => {
  const conversationId = 'myAssistantConversation';
  const client = new IoTSitewiseAssistantClient({
    iotSiteWiseClient: {
      invokeAssistant: MockInvokeAssistant,
    },
    assistantId: 'myAssistantId',
    defaultContext: '',
  });
  const mockGetState = jest.fn().mockImplementation(() => () => ({ messages: [] }));

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
      expect(result.current.messages.length).toBe(2);
    });
  });

  it('should allow a custom messageParser ', async () => {
    const mockedParser = jest.fn();
    const newClient = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: MockInvokeAssistant,
      },
      assistantId: 'myAssistantId',
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

  it('should invoke Assistant', async () => {
    const mockedInvokeAssistant = jest
      .fn()
      .mockImplementation(MockInvokeAssistant);
    const newClient = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockedInvokeAssistant,
      },
      assistantId: 'myAssistantId',
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
    const context = '{"assetId": "assetId1"}';
    const mockedInvokeAssistant = jest
      .fn()
      .mockImplementation(MockInvokeAssistant);
    const newClient = new IoTSitewiseAssistantClient({
      iotSiteWiseClient: {
        invokeAssistant: mockedInvokeAssistant,
      },
      assistantId: 'myAssistantId',
      defaultContext: '',
    });
    const { result } = renderHook(() =>
      useAssistant({
        assistantClient: newClient,
      })
    );

    await act(() => {
      result.current.generateSummary(conversationId, context, summaryUtterance);
    });

    await waitFor(() => {
      expect(mockedInvokeAssistant).toBeCalledWith({
        conversationId,
        assistantId: 'myAssistantId',
        enabledTrace: true,
        invocationInputs: {
          messages: [{ text: summaryUtterance }],
          metadata: {
            context,
          },
        },
      });
    });
  });
});
