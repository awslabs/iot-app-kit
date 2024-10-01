import React from 'react';
import { act, render, renderHook, screen } from '@testing-library/react';
import {
  AssistantWrapperPanel,
  AssistantWrapperPanelProps,
} from './assistantWrapperPanel';
import userEvent from '@testing-library/user-event';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import type {
  AssistantActionEventDetail,
  AssistantProperty,
} from '../../common/assistantProps';
import type { IoTSiteWise } from '@amzn/iot-black-pearl-internal-v3';
import { useAssistant } from '../../hooks/useAssistant/useAssistant';

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
  target: 'widget',
  client,
} satisfies AssistantProperty;

const component = (props: Partial<AssistantWrapperPanelProps>) => (
  <AssistantWrapperPanel
    {...props}
    assistant={props.assistant || assistant}
    componentType='kpi'
  >
    <div
      data-testid='childComponent'
      style={{ width: '400px', height: '300px' }}
    />
  </AssistantWrapperPanel>
);

describe('ActionPanel', () => {
  it('renders with component', () => {
    expect(() => {
      render(component({}));
    }).not.toThrowError();
  });

  it('show result panel when summarize action is started', async () => {
    const mockedSummarizeAction = jest.fn();
    render(
      component({
        assistant: {
          ...assistant,
          onAction: (event: AssistantActionEventDetail) =>
            mockedSummarizeAction(event),
        },
      })
    );

    const { result } = renderHook(() =>
      useAssistant({
        assistantClient: client,
      })
    );

    act(() => {
      result.current.generateSummary({
        componentId: 'componentId',
        conversationId: 'conversationId',
        target: 'widget',
        utterance: 'generate a summary',
      });
    });

    expect(
      screen.getByRole('button', { name: /Chat with AI/i })
    ).toBeInTheDocument();
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

    const { result } = renderHook(() =>
      useAssistant({
        assistantClient: client,
      })
    );

    act(() => {
      result.current.generateSummary({
        componentId: 'componentId',
        conversationId: 'conversationId',
        target: 'widget',
        utterance: 'generate a summary',
      });
    });

    expect(
      screen.getByRole('button', { name: /Chat with AI/i })
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Chat with AI/i }));

    expect(mockedDivedeepAction).toHaveBeenCalledWith({
      type: 'divedeep',
      sourceComponentId: 'componentId',
      messages: [],
    });
  });
});
