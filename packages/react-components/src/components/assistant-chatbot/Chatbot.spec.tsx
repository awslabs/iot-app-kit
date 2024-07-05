import React from 'react';
import { render } from '@testing-library/react';
import { SenderType, MessageType } from '../../hooks/useAssistant/types';
import { Chatbot } from './Chatbot';
import { InvokeAssistantResponse } from '@iot-app-kit/core-util';

describe('Chatbot', () => {

  it('should render customer message',() => {
    const content = 'What is the root cause of this alarm?';
    const { container } = render(
      <Chatbot 
        height={400}
        messages={[
          {
            content,
            sender: SenderType.USER,
            type: MessageType.TEXT,
            id: 'UniqueID',
            loading: false
          }
        ]}
      />
    );
    const [ firstMessage ] = container.querySelectorAll('.iot-app-kit.assistant-chatbot .customer-message');
  
    expect(firstMessage).not.toBeNull();
    expect(firstMessage).toHaveTextContent(content);
  });

  it('should render assistant message',() => {
    const content = 'AWS IoT SiteWise makes it easy to collect, store, organize and monitor indsutrial data.';
    const { container } = render(
      <Chatbot 
        height={400}
        messages={[
          {
            content,
            sender: SenderType.ASSISTANT,
            type: MessageType.TEXT,
            id: 'UniqueID',
            loading: false
          }
        ]}
      />
    );

    const [ firstMessage ] = container.querySelectorAll('[data-testid="assistant-chatbot-assistant-message"]');
    expect(firstMessage).not.toBeNull();
    expect(firstMessage).toHaveTextContent(content);
  });

  it('should render assistant message with citations',() => {
    const content = 'AWS IoT SiteWise makes it easy to collect, store, organize and monitor indsutrial data.';
    const citationText =  'SOP documents';
    const { container } = render(
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
              response: {
                citations: [{
                  references: [{
                    content: {
                      text: citationText,
                    },
                    location: {
                      s3Location: {
                        uri: ''
                      },
                      type: ''
                    }
                  }],
                }],
              },
            } as InvokeAssistantResponse
          }
        ]}
      />
    );

    const [ firstMessage ] = container.querySelectorAll('[data-testid="assistant-chatbot-assistant-message"]');
    expect(firstMessage).not.toBeNull();
    expect(firstMessage).toHaveTextContent(content);

    const [ citation ] = container.querySelectorAll('[data-testid="assistant-chatbot-message-citation-link"]');
    expect(citation).not.toBeNull();
    expect(citation).toHaveTextContent(citationText);
  });

});