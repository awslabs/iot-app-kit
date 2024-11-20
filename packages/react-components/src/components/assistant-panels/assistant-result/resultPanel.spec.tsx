import type { ResponseStream } from '@aws-sdk/client-iotsitewise';
import { render, screen } from '@testing-library/react';
import ue from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import { MessageType } from '../../../hooks/useAssistant/types';
import { ResultPanel, type ResultPanelProps } from './resultPanel';

const component = (props: Partial<ResultPanelProps>) => (
  <IntlProvider locale='en' defaultLocale='en'>
    <ResultPanel
      componentId='componentId'
      messages={[]}
      onClose={() => {}}
      onDivedeep={() => {}}
      {...props}
    />
  </IntlProvider>
);

describe('ResultPanel', () => {
  it('renders without errors', () => {
    expect(() => {
      render(component({}));
    }).not.toThrowError();
  });

  it('renders assistant messages only and not customer messages', async () => {
    render(
      component({
        messages: [
          {
            sender: 'assistant',
            content: 'Assistant response',
            type: MessageType.TEXT,
            id: 'UniqueID1',
            loading: false,
            originComponentId: 'componentId',
          },
          {
            sender: 'user',
            content: 'Customer message',
            type: MessageType.TEXT,
            id: 'UniqueID2',
            loading: false,
            originComponentId: 'componentId',
          },
        ],
      })
    );

    expect(screen.getByText('Assistant response')).toBeInTheDocument();
    expect(screen.queryByText('Customer message')).toBeNull();
  });

  it('renders assistant trace messages while processig the final result', async () => {
    render(
      component({
        messages: [
          {
            sender: 'assistant',
            content: 'Loading assistant response',
            type: MessageType.TEXT,
            id: 'UniqueID1',
            loading: true,
            originComponentId: 'componentId',
          },
        ],
      })
    );

    expect(screen.getByText('Loading assistant response')).toBeInTheDocument();
  });

  it('renders citations for the final assistant result', async () => {
    const citationText = 'SOP documents';
    render(
      component({
        messages: [
          {
            sender: 'assistant',
            content: 'Loading assistant response',
            type: MessageType.TEXT,
            id: 'UniqueID1',
            originComponentId: 'componentId',
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
        ],
      })
    );

    expect(screen.getByText(citationText)).toBeInTheDocument();
  });

  it('fires closes action when close button is clicked', async () => {
    const user = ue.setup();
    const mockOnClose = vi.fn();
    render(
      component({
        onClose: mockOnClose,
      })
    );

    await user.click(screen.getByRole('button', { name: /Close/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('fires divedeep action when "Chat with AI" action item is clicked', async () => {
    const mockedDivedeepAction = vi.fn();
    const user = ue.setup();
    render(
      component({
        onDivedeep: mockedDivedeepAction,
      })
    );

    await user.click(screen.getByText(/Chat with AI/i));
    expect(mockedDivedeepAction).toHaveBeenCalled();
  });
});
