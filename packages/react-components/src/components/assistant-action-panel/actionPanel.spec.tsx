import React from 'react';
import { render, screen } from '@testing-library/react';
import { ActionPanel, ActionPanelProps } from './actionPanel';
import userEvent from '@testing-library/user-event';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import type { AssistantActionEventDetail } from '../../common/assistantProps';
import type { IoTSiteWise } from '@amzn/iot-black-pearl-internal-v3';

const client = new IoTSitewiseAssistantClient({
  iotSiteWiseClient: {
    invokeAssistant: jest.fn().mockResolvedValue([]),
  } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
  defaultContext: '',
});

const assistant = {
  onAction: (_event: AssistantActionEventDetail) => jest.fn(),
  componentId: 'componentId',
  conversationId: 'conversationId',
  client,
};

const component = (props: Partial<ActionPanelProps>) => (
  <ActionPanel {...props} assistant={props.assistant || assistant}>
    <div
      data-testid='childComponent'
      style={{ width: '400px', height: '300px' }}
    />
  </ActionPanel>
);

describe('ActionPanel', () => {
  it('renders with component', () => {
    expect(() => {
      render(component({}));
    }).not.toThrowError();
  });

  it('renders when action panel is on the left', () => {
    expect(() => {
      render(component({ iconPosition: 'topLeft' }));
    }).not.toThrowError();
  });

  it('renders when action panel is on the right', () => {
    expect(() => {
      render(component({ iconPosition: 'topRight' }));
    }).not.toThrowError();
  });

  it('opens assistant action dropdown menu on button click', async () => {
    const user = userEvent.setup();
    render(component({}));

    await user.click(screen.getByTestId('action-panel-menu-button'));
    expect(
      screen.getByRole('button', { name: /Summarize/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Chat with AI/i })
    ).toBeInTheDocument();
  });

  it('closes action dropdown on action item click', async () => {
    const user = userEvent.setup();
    render(component({}));

    await user.click(screen.getByTestId('action-panel-menu-button'));
    await user.click(screen.getByRole('button', { name: /Summarize/i }));
    expect(screen.queryByTestId('action-panel-summarize-button')).toBeNull();

    await user.click(screen.getByTestId('action-panel-menu-button'));
    await user.click(screen.getByRole('button', { name: /Chat with AI/i }));
    expect(screen.queryByTestId('action-panel-chatbot-button')).toBeNull();
  });

  it('fires divedeep action when "Chat with AI" action item is clicked', async () => {
    const mockedDivedeepAction = jest.fn();
    const user = userEvent.setup();
    render(
      component({
        assistant: {
          ...assistant,
          onAction: (event: AssistantActionEventDetail) =>
            mockedDivedeepAction(event),
        },
      })
    );

    await user.click(screen.getByTestId('action-panel-menu-button'));
    await user.click(screen.getByRole('button', { name: /Chat with AI/i }));

    expect(mockedDivedeepAction).toHaveBeenCalledWith({
      type: 'divedeep',
      sourceComponentId: 'componentId',
      messages: [],
    });
  });

  it('fires summarize action when Summarize action item is clicked', async () => {
    const mockedSummarizeAction = jest.fn();
    const user = userEvent.setup();
    render(
      component({
        assistant: {
          ...assistant,
          onAction: (event: AssistantActionEventDetail) =>
            mockedSummarizeAction(event),
        },
      })
    );

    await user.click(screen.getByTestId('action-panel-menu-button'));
    await user.click(screen.getByRole('button', { name: /Summarize/i }));

    expect(mockedSummarizeAction).toHaveBeenCalledWith({
      type: 'summarize',
      sourceComponentId: 'componentId',
      messages: [],
    });
  });
});
