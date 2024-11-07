import type { IoTSiteWise } from '@amzn/iot-black-pearl-internal-v3';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import type {
  AssistantActionEventDetail,
  AssistantProperty,
} from '../../common/assistantProps';
import { TableHeader } from './tableHeader';

const client = new IoTSitewiseAssistantClient({
  iotSiteWiseClient: {
    invokeAssistant: jest.fn(),
  } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
  defaultContext: '',
});

const assistant = {
  enabled: true,
  onAction: (_event: AssistantActionEventDetail) => jest.fn(),
  conversationId: 'conversationId',
  componentId: 'componentId',
  target: 'widget',
  client,
} satisfies AssistantProperty;

describe('title', () => {
  it('renders correctly', () => {
    const title = 'Table Header Title';
    const { getByText } = render(
      <IntlProvider locale='en' defaultLocale='en'>
        <TableHeader titleText={title} selectedItems={0} totalItems={10} />
      </IntlProvider>
    );
    expect(getByText(`${title} (10)`)).toBeInTheDocument();
  });
});

describe('counter', () => {
  it('display number of rows correctly', () => {
    const { getByText } = render(
      <IntlProvider locale='en' defaultLocale='en'>
        <TableHeader titleText='Title' selectedItems={0} totalItems={7} />
      </IntlProvider>
    );
    expect(getByText('Title (7)')).toBeInTheDocument();
  });
  it('display number of rows and selected rows correctly', () => {
    const { getByText } = render(
      <IntlProvider locale='en' defaultLocale='en'>
        <TableHeader titleText='Title' selectedItems={3} totalItems={7} />
      </IntlProvider>
    );
    expect(getByText('Title (3/7)')).toBeInTheDocument();
  });
});

describe('Generate Summary', () => {
  it('onSummarize is called when customer clicks on summary button', async () => {
    const user = userEvent.setup();
    const mockSummarize = jest.fn();
    const { getByRole } = render(
      <IntlProvider locale='en' defaultLocale='en'>
        <TableHeader
          selectedItems={1}
          totalItems={7}
          assistant={assistant}
          onSummarize={mockSummarize}
        />
      </IntlProvider>
    );

    expect(
      getByRole('button', { name: 'Generate Summary' })
    ).toBeInTheDocument();
    await user.click(getByRole('button', { name: 'Generate Summary' }));

    expect(mockSummarize).toBeCalled();
  });
});

describe('Property limitation', () => {
  it('should display popover when customer selects at least 3 properties', async () => {
    const { getByText } = render(
      <IntlProvider locale='en' defaultLocale='en'>
        <TableHeader selectedItems={3} totalItems={7} assistant={assistant} />
      </IntlProvider>
    );
    await waitFor(() => {
      expect(getByText('Property Selection Limit')).toBeInTheDocument();
    });
  });
});
