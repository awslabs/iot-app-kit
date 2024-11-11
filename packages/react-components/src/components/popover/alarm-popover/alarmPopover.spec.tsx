import type { IoTSiteWise } from '@amzn/iot-black-pearl-internal-v3';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import type { PascalCaseStateName } from '@iot-app-kit/source-iotsitewise';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  type AssistantActionEventDetail,
  type AssistantProperty,
} from '../../../common/assistantProps';
import * as useAssistant from '../../../hooks/useAssistant/useAssistant';
import { type AlarmContent } from '../../alarm-components/alarm-content/types';
import { AlarmPopover, type AlarmPopoverProps } from './alarmPopover';

jest.mock('../../../hooks/useAssistant/useAssistant');

const mockGenerateSummary = jest.fn();
jest.spyOn(useAssistant, 'useAssistant').mockReturnValue({
  actions: {},
  setMessages: jest.fn(),
  invokeAssistant: jest.fn(),
  actionsByComponent: {},
  startAction: jest.fn(),
  clearActions: jest.fn(),
  clearAll: jest.fn(),
  messages: [],
  generateSummary: mockGenerateSummary,
});

const client = new IoTSitewiseAssistantClient({
  iotSiteWiseClient: {
    invokeAssistant: jest.fn().mockResolvedValue([]),
  } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
  defaultContext: '',
});

const mockOnAction = jest
  .fn()
  .mockImplementation((_event: AssistantActionEventDetail) => jest.fn());
const assistant = {
  onAction: mockOnAction,
  conversationId: 'conversationId',
  componentId: 'componentId',
  client,
  target: 'dashboard',
} satisfies AssistantProperty;

const mockAlarmName = 'mockAlarmName';
const mockAlarmExpression = 'property = 30';
const mockState = 'Active' satisfies PascalCaseStateName;
const mockSeverity = 1;

const mockAlarmContent = {
  alarmName: mockAlarmName,
  alarmExpression: mockAlarmExpression,
  alarmState: mockState,
  severity: mockSeverity,
} satisfies AlarmContent;

const component = (props: Partial<AlarmPopoverProps>) => (
  <AlarmPopover
    title={props.title || 'title'}
    content={props.content || <></>}
    footerText={props.footerText || 'last 1 hour'}
    assistant={assistant}
    alarmContent={mockAlarmContent}
  >
    <button>Popover button</button>
  </AlarmPopover>
);

describe('AlarmPopover', () => {
  it('renders with component', () => {
    expect(() => {
      render(component({ assistant }));
    }).not.toThrowError();
  });

  it('renders title', async () => {
    const text = 'Test Title';
    const user = userEvent.setup();
    const { getByText, getByRole } = render(component({ title: text }));
    await user.click(getByRole('button', { name: /Popover button/i }));
    expect(getByText(text)).toBeInTheDocument();
  });

  it('renders Footer Text', async () => {
    const text = 'Footer Text';
    const user = userEvent.setup();
    const { getByText, getByRole } = render(component({ footerText: text }));
    await user.click(getByRole('button', { name: /Popover button/i }));
    expect(getByText(text)).toBeInTheDocument();
  });

  it('renders alarm content', async () => {
    const user = userEvent.setup();
    const { getByText, getByRole } = render(component({}));
    await user.click(getByRole('button', { name: /Popover button/i }));
    expect(getByText(mockAlarmName)).toBeInTheDocument();
  });

  it('renders summary button when assistant property is passed', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(component({}));
    await user.click(getByRole('button', { name: /Popover button/i }));
    expect(
      getByRole('button', { name: /Generate summary/i })
    ).toBeInTheDocument();
    await user.click(getByRole('button', { name: /Generate summary/i }));
    expect(mockGenerateSummary).toBeCalled();
    expect(mockOnAction).toBeCalled();
  });
});
