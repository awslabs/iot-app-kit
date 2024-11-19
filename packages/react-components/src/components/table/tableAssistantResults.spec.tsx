import type { IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import { render } from '@testing-library/react';
import { mockedInvokeAssistantResponse3 } from '../../__mocks__/assistantMockedResponse';
import type {
  AssistantActionEventDetail,
  AssistantProperty,
} from '../../common/assistantProps';
import { TableAssistantResults } from './tableAssistantResults';

const client = new IoTSitewiseAssistantClient({
  iotSiteWiseClient: {
    invokeAssistant: jest
      .fn()
      .mockResolvedValue([mockedInvokeAssistantResponse3]),
  } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
  defaultContext: '',
});

const assistant = {
  enabled: true,
  componentId: 'componentId',
  onAction: (_event: AssistantActionEventDetail) => jest.fn(),
  conversationId: 'conversationId',
  target: 'widget',
  client,
} satisfies AssistantProperty;

describe('TableAssistantResults', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    expect(() => {
      render(
        <TableAssistantResults
          assistant={assistant}
          showSummarization={false}
          onSummarizationEnd={() => {}}
        />
      );
    }).not.toThrowError();
  });

  it('renders with children components', () => {
    const { getByText } = render(
      <TableAssistantResults
        assistant={assistant}
        showSummarization={false}
        onSummarizationEnd={() => {}}
      >
        <div>Children Text</div>
      </TableAssistantResults>
    );

    expect(getByText('Children Text')).toBeInTheDocument();
  });

  it('fires summarize action when summarize action item is clicked', () => {
    const mockedSummarizeAction = jest.fn();
    render(
      <TableAssistantResults
        assistant={assistant}
        showSummarization={true}
        onSummarizationEnd={mockedSummarizeAction}
      />
    );

    expect(mockedSummarizeAction).toHaveBeenCalled();
  });
});
