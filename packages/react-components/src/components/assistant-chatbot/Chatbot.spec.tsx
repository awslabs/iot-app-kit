import React from 'react';
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SenderType, MessageType } from '../../hooks/useAssistant/types';
import { Chatbot } from './Chatbot';
import { InvokeAssistantResponse } from '@iot-app-kit/core-util';

describe('Chatbot', () => {
  it('should render customer message', () => {
    const content = 'What is the root cause of this alarm?';
    const { container } = render(
      <Chatbot
        height={400}
        messages={[
          {
            content,
            sender: SenderType.USER,
            type: MessageType.TEXT,
            id: 'UniqueID',
            loading: false,
          },
        ]}
        onSubmit={() => {}}
      />
    );
    const [firstMessage] = container.querySelectorAll(
      '.iot-app-kit.assistant-chatbot .customer-message'
    );

    expect(firstMessage).toBeDefined();
    expect(firstMessage).toHaveTextContent(content);
  });

  it('should render assistant loading message', () => {
    const content = 'Generating a response...';
    const { container } = render(
      <Chatbot
        height={400}
        messages={[
          {
            content,
            sender: SenderType.ASSISTANT,
            type: MessageType.TEXT,
            id: 'UniqueID',
            loading: true,
          },
        ]}
        onSubmit={() => {}}
      />
    );
    const [processingIcon] = container.querySelectorAll(
      '.iot-app-kit.assistant-chatbot .processing-message-icon'
    );
    expect(processingIcon).toBeDefined();

    const [firstMessage] = container.querySelectorAll(
      '.iot-app-kit.assistant-chatbot .assistant-message'
    );
    expect(firstMessage).toBeDefined();
    expect(firstMessage).toHaveTextContent(content);
  });

  it('should render assistant message', () => {
    const content =
      'AWS IoT SiteWise makes it easy to collect, store, organize and monitor indsutrial data.';
    const { container } = render(
      <Chatbot
        height={400}
        messages={[
          {
            content,
            sender: SenderType.ASSISTANT,
            type: MessageType.TEXT,
            id: 'UniqueID',
            loading: false,
          },
        ]}
        onSubmit={() => {}}
      />
    );

    const [firstMessage] = container.querySelectorAll(
      '[data-testid="assistant-chatbot-assistant-message"]'
    );
    expect(firstMessage).toBeDefined();
    expect(firstMessage).toHaveTextContent(content);
  });

  it('should render assistant message with citations', () => {
    const content =
      'AWS IoT SiteWise makes it easy to collect, store, organize and monitor indsutrial data.';
    const citationText = 'SOP documents';
    const { container } = render(
      <Chatbot
        height={400}
        messages={[
          {
            content,
            sender: SenderType.ASSISTANT,
            type: MessageType.TEXT,
            id: 'UniqueID',
            loading: false,
            payload: {
              finalResponse: {
                citations: [
                  {
                    references: [
                      {
                        content: {
                          text: citationText,
                        },
                        location: {
                          s3Location: {
                            uri: '',
                          },
                          type: '',
                        },
                      },
                    ],
                  },
                ],
              },
            } as InvokeAssistantResponse,
          },
        ]}
        onSubmit={() => {}}
      />
    );

    const [firstMessage] = container.querySelectorAll(
      '[data-testid="assistant-chatbot-assistant-message"]'
    );
    expect(firstMessage).toBeDefined();
    expect(firstMessage).toHaveTextContent(content);

    const [citation] = container.querySelectorAll(
      '[data-testid="assistant-chatbot-message-citation-link"]'
    );
    expect(citation).toBeDefined();
    expect(citation).toHaveTextContent(citationText);
  });

  it('should render prompts and be able to click on it', () => {
    const mockOnCLick = jest.fn();
    const content =
      'AWS IoT SiteWise makes it easy to collect, store, organize and monitor indsutrial data.';
    const promptText = 'What are the recommendations?';
    const { container } = render(
      <Chatbot
        height={400}
        messages={[
          {
            content,
            sender: SenderType.ASSISTANT,
            type: MessageType.PROMPTS,
            id: 'UniqueID',
            loading: false,
            payload: [promptText],
          },
        ]}
        onSubmit={mockOnCLick}
      />
    );
    const [promptButton] = container.querySelectorAll(
      '[data-testid="assistant-chatbot-message-prompt-button"]'
    );
    expect(promptButton).toBeDefined();
    expect(promptButton).toHaveTextContent(promptText);

    (promptButton as HTMLButtonElement).click();
    expect(mockOnCLick).toBeCalled();
  });

  it('should call assistant API and send user message', async () => {
    const user = userEvent.setup();
    const mockOnCLick = jest.fn();
    const message = 'What is the root cause of the alarm?';

    const { container } = render(
      <Chatbot
        height={400}
        messages={[
          {
            content: '',
            sender: SenderType.ASSISTANT,
            type: MessageType.TEXT,
            id: 'UniqueID',
            loading: false,
          },
        ]}
        onSubmit={mockOnCLick}
      />
    );

    const textarea = container.querySelector('textarea');
    expect(textarea).toBeDefined();
    await act(async () => {
      return await user.type(textarea!, message);
    });

    const inputButton = container.querySelector(
      '[data-testid="assistant-chatbot-input-button"]'
    );
    expect(inputButton).toBeDefined();

    act(() => {
      (inputButton as HTMLButtonElement).click();
    });
    expect(mockOnCLick).toBeCalledWith(message);
  });
});
