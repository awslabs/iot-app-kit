import React from 'react';
import { render } from '@testing-library/react';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import { TableAssistantResults } from './tableAssistantResults';
import type { IoTSiteWise } from '@amzn/iot-black-pearl-internal-v3';
import type { AssistantActionEventDetail } from '../../common/assistantProps';
import { mockedInvokeAssistantResponse3 } from '../../__mocks__/assistantMockedResponse';

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
  onAction: (_event: AssistantActionEventDetail) => jest.fn(),
  conversationID: 'conversationID',
  client,
};

describe('TableAssistantResults', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    expect(() => {
      render(
        <TableAssistantResults
          assistant={assistant}
          componentId='componentId'
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
        componentId='componentId'
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
        componentId='componentId'
        showSummarization={true}
        onSummarizationEnd={mockedSummarizeAction}
      />
    );

    expect(mockedSummarizeAction).toHaveBeenCalled();
  });
});
