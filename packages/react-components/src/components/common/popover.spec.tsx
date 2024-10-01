import React from 'react';
import { render } from '@testing-library/react';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import type {
  AssistantActionEventDetail,
  AssistantProperty,
} from '../../common/assistantProps';
import type { IoTSiteWise } from '@amzn/iot-black-pearl-internal-v3';
import { Popover, type PopoverProps } from './popover';
import userEvent from '@testing-library/user-event';

const client = new IoTSitewiseAssistantClient({
  iotSiteWiseClient: {
    invokeAssistant: jest.fn().mockResolvedValue([]),
  } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
  defaultContext: '',
});

const assistant = {
  onAction: (_event: AssistantActionEventDetail) => jest.fn(),
  conversationId: 'conversationId',
  componentId: 'componentId',
  target: 'widget',
  client,
} satisfies AssistantProperty;

const component = (props: Partial<PopoverProps>) => (
  <Popover
    title={props.title || 'title'}
    content={props.content || <></>}
    footerText={props.footerText || 'last 1 hour'}
    assistant={props.assistant || assistant}
  >
    <button>Popover button</button>
  </Popover>
);

describe('Popover', () => {
  it('renders with component', () => {
    expect(() => {
      render(component({}));
    }).not.toThrowError();
  });

  it('renders title', async () => {
    const user = userEvent.setup();
    const { getByText, getByRole } = render(component({ title: 'Test Title' }));

    await user.click(getByRole('button', { name: /Popover button/i }));
    expect(getByText('Test Title')).toBeInTheDocument();
  });

  it('renders content', async () => {
    const user = userEvent.setup();
    const { getByText, getByRole } = render(
      component({ content: <span>Content</span> })
    );

    await user.click(getByRole('button', { name: /Popover button/i }));
    expect(getByText('Content')).toBeInTheDocument();
  });

  it('renders footer Text', async () => {
    const user = userEvent.setup();
    const { getByText, getByRole } = render(
      component({ footerText: 'Footer Text' })
    );

    await user.click(getByRole('button', { name: /Popover button/i }));
    expect(getByText('Footer Text')).toBeInTheDocument();
  });

  it('renders summary button when assistant property is passed', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(component({}));

    await user.click(getByRole('button', { name: /Popover button/i }));
    expect(
      getByRole('button', { name: /Generate summary/i })
    ).toBeInTheDocument();
  });
});
