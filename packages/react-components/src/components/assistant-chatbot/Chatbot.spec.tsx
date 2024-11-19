import type { ResponseStream } from '@amzn/iot-black-pearl-internal-v3';
import { render } from '@testing-library/react';
import ue from '@testing-library/user-event';
import { MessageType } from '../../hooks/useAssistant/types';
import { Chatbot } from './Chatbot';

describe(Chatbot, () => {
  it('should render customer message', () => {
    const content = 'What is the root cause of this alarm?';
    const { getByText } = render(
      <Chatbot
        height={400}
        messages={[
          {
            content,
            sender: 'user',
            type: MessageType.TEXT,
            id: 'UniqueID',
            loading: false,
          },
        ]}
        onSubmit={() => {}}
      />
    );
    expect(getByText(content)).toBeInTheDocument();
  });

  it('should render chatbot header', () => {
    const headerText = 'Chatbot header';
    const { getByText } = render(
      <Chatbot
        height={400}
        header={{
          headerText,
        }}
        messages={[]}
        onSubmit={() => {}}
      />
    );
    expect(getByText(headerText)).toBeInTheDocument();
  });

  it('should render assistant loading message', () => {
    const content = 'Generating a response...';
    const { getByText, getByRole } = render(
      <Chatbot
        height={400}
        messages={[
          {
            content,
            sender: 'assistant',
            type: MessageType.TEXT,
            id: 'UniqueID',
            loading: true,
          },
        ]}
        onSubmit={() => {}}
      />
    );
    expect(getByRole('progressbar')).toBeInTheDocument();
    expect(getByText(content)).toBeInTheDocument();
  });

  it('should render assistant message', () => {
    const content =
      'AWS IoT SiteWise makes it easy to collect, store, organize and monitor indsutrial data.';
    const { getByText } = render(
      <Chatbot
        height={400}
        messages={[
          {
            content,
            sender: 'assistant',
            type: MessageType.TEXT,
            id: 'UniqueID',
            loading: false,
          },
        ]}
        onSubmit={() => {}}
      />
    );
    expect(getByText(content)).toBeInTheDocument();
  });

  it('should render assistant message with citations', () => {
    const content =
      'AWS IoT SiteWise makes it easy to collect, store, organize and monitor indsutrial data.';
    const citationText = 'SOP documents';
    const { getByText } = render(
      <Chatbot
        height={400}
        messages={[
          {
            content,
            sender: 'assistant',
            type: MessageType.TEXT,
            id: 'UniqueID',
            loading: false,
            payload: {
              output: {
                citations: [
                  {
                    content: {
                      text: citationText,
                    },
                    reference: {
                      dataset: {
                        source: {
                          location: {
                            uri: 'http://test.url.com',
                          },
                        },
                      },
                    },
                  },
                ],
              },
            } satisfies ResponseStream,
          },
        ]}
        onSubmit={() => {}}
      />
    );
    expect(getByText(content)).toBeInTheDocument();
    expect(getByText(citationText)).toBeInTheDocument();
  });

  it('should render assistant error message', () => {
    const content = 'Access Denied Exception';
    const { getByText } = render(
      <Chatbot
        height={400}
        messages={[
          {
            content,
            sender: 'assistant',
            type: MessageType.ERROR,
            id: 'UniqueID',
            loading: false,
            payload: {
              accessDeniedException: {
                name: 'accessDeniedException',
                message: 'message accessDeniedException',
              },
            },
          },
        ]}
        onSubmit={() => {}}
      />
    );
    expect(getByText(content)).toBeInTheDocument();
  });

  it('should render prompts and be able to click on it', async () => {
    const user = ue.setup();
    const mockOnCLick = vi.fn();
    const content =
      'AWS IoT SiteWise makes it easy to collect, store, organize and monitor indsutrial data.';
    const promptText = 'What are the recommendations?';
    const { getByText, getByRole } = render(
      <Chatbot
        height={400}
        messages={[
          {
            content,
            sender: 'assistant',
            type: MessageType.PROMPTS,
            id: 'UniqueID',
            loading: false,
            payload: [promptText],
          },
        ]}
        onSubmit={mockOnCLick}
      />
    );
    expect(getByText(promptText)).toBeInTheDocument();
    await user.click(getByRole('button', { name: promptText }));
    expect(mockOnCLick).toBeCalled();
  });

  it('should call assistant API and send user message', async () => {
    const user = ue.setup();
    const mockOnCLick = vi.fn();
    const message = 'What is the root cause of the alarm?';

    const { getByPlaceholderText, getByTestId } = render(
      <Chatbot
        height={400}
        messages={[
          {
            content: '',
            sender: 'assistant',
            type: MessageType.TEXT,
            id: 'UniqueID',
            loading: false,
          },
        ]}
        onSubmit={mockOnCLick}
      />
    );

    const textarea = getByPlaceholderText(
      'Ask me anything about your IoT data'
    );
    expect(textarea).toBeInTheDocument();
    await user.type(textarea!, message);

    const inputButton = getByTestId('assistant-chatbot-input-button');
    expect(inputButton).toBeInTheDocument();

    await user.click(inputButton);
    expect(mockOnCLick).toBeCalledWith(message);
  });

  it('should call onClose callback when chatbot is closed', async () => {
    const user = ue.setup();
    const mockOnClose = vi.fn();
    const { getByRole } = render(
      <Chatbot
        height={400}
        messages={[]}
        onSubmit={() => {}}
        header={{
          headerText: 'Header',
          showCloseButton: true,
          onClose: mockOnClose,
        }}
      />
    );
    expect(getByRole('button', { name: 'Close' })).toBeInTheDocument();

    await user.click(getByRole('button', { name: 'Close' }));

    expect(mockOnClose).toBeCalled();
  });

  it('should call onReset callback when reset button is clicked', async () => {
    const user = ue.setup();
    const mockOnReset = vi.fn();
    const { getByRole } = render(
      <Chatbot
        height={400}
        messages={[]}
        onSubmit={() => {}}
        header={{
          headerText: 'Header',
          showResetButton: true,
          onReset: mockOnReset,
        }}
      />
    );
    expect(getByRole('button', { name: 'New chat' })).toBeInTheDocument();

    await user.click(getByRole('button', { name: 'New chat' }));

    expect(mockOnReset).toBeCalled();
  });

  it('should resize message container when customer types breakline', async () => {
    const user = ue.setup();
    const { getByPlaceholderText, getByTestId } = render(
      <Chatbot
        height={500}
        messages={[
          {
            content: '',
            sender: 'assistant',
            type: MessageType.TEXT,
            id: 'UniqueID',
            loading: false,
          },
        ]}
        onSubmit={vi.fn()}
      />
    );

    const textarea = getByPlaceholderText(
      'Ask me anything about your IoT data'
    );
    expect(textarea).toBeInTheDocument();

    await user.type(textarea!, 'some text\n');
    await user.type(textarea!, 'some text\n');

    const inputContainer = getByTestId(
      'assistant-chatbot-conversation-container'
    );
    expect(inputContainer).toBeInTheDocument();
    expect(inputContainer.style.height).toBe('450px');
  });
});
