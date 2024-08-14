import React from 'react';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { SenderType, MessageType } from '../../hooks/useAssistant/types';
import { Chatbot } from './Chatbot';
import userEvent from '@testing-library/user-event';

describe(Chatbot, () => {
  it('should render customer message', () => {
    const content = 'What is the root cause of this alarm?';
    render(
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
    expect(screen.getByText(content)).toBeInTheDocument();
  });

  it('should render assistant loading message', () => {
    const content = 'Generating a response...';
    render(
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
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText(content)).toBeInTheDocument();
  });

  it('should render assistant message', () => {
    const content =
      'AWS IoT SiteWise makes it easy to collect, store, organize and monitor indsutrial data.';
    render(
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
    expect(screen.getByText(content)).toBeInTheDocument();
  });

  it('should render assistant message with citations', () => {
    const content =
      'AWS IoT SiteWise makes it easy to collect, store, organize and monitor indsutrial data.';
    const citationText = 'SOP documents';
    render(
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
                            uri: 'http://test.url.com',
                          },
                          type: '',
                        },
                      },
                    ],
                  },
                ],
              },
            } as any,
          },
        ]}
        onSubmit={() => {}}
      />
    );
    expect(screen.getByText(content)).toBeInTheDocument();
    expect(screen.getByText(citationText)).toBeInTheDocument();
  });

  it('should render prompts and be able to click on it', () => {
    const mockOnCLick = jest.fn();
    const content =
      'AWS IoT SiteWise makes it easy to collect, store, organize and monitor indsutrial data.';
    const promptText = 'What are the recommendations?';
    render(
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
    expect(screen.getByText(promptText)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: promptText }));
    expect(mockOnCLick).toBeCalled();
  });

  it('should call assistant API and send user message', async () => {
    const user = userEvent.setup();
    const mockOnCLick = jest.fn();
    const message = 'What is the root cause of the alarm?';

    render(
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

    const textarea = screen.getByPlaceholderText(
      'Ask me anything about your IoT data'
    );
    expect(textarea).toBeInTheDocument();

    await act(async () => {
      return await user.type(textarea!, message);
    });

    const inputButton = screen.getByTestId('assistant-chatbot-input-button');
    expect(inputButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(inputButton);
    });
    expect(mockOnCLick).toBeCalledWith(message);
  });

  it('should call onClose callback when chatbot is closed', () => {
    const mockOnClose = jest.fn();
    render(
      <Chatbot
        height={400}
        messages={[]}
        onSubmit={() => {}}
        onClose={mockOnClose}
      />
    );
    const closeButton = screen.getByTestId('assistant-chatbot-close-button');
    expect(closeButton).toBeInTheDocument();
    act(() => {
      fireEvent.click(closeButton);
    });
    expect(mockOnClose).toBeCalled();
  });

  it('should resize message container when customer types breakline', async () => {
    const user = userEvent.setup();
    render(
      <Chatbot
        height={500}
        messages={[
          {
            content: '',
            sender: SenderType.ASSISTANT,
            type: MessageType.TEXT,
            id: 'UniqueID',
            loading: false,
          },
        ]}
        onSubmit={jest.fn()}
      />
    );

    const textarea = screen.getByPlaceholderText(
      'Ask me anything about your IoT data'
    );
    expect(textarea).toBeInTheDocument();

    await act(async () => {
      return await user.type(textarea!, 'some text\n');
    });

    await act(async () => {
      return await user.type(textarea!, 'some text\n');
    });

    const inputContainer = screen.getByTestId(
      'assistant-chatbot-conversation-container'
    );
    expect(inputContainer).toBeInTheDocument();
    expect(inputContainer.style.height).toBe('450px');
  });
});
