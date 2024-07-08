import * as React from 'react';
import { InvokeAssistantResponse } from '@iot-app-kit/core-util';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import assistantIcon from '../assets/assistantIcon.svg';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';

export interface ChatbotAssistantMessageProps {
  text: string;
  payload?: InvokeAssistantResponse;
}

export const ChatbotAssistantMessage = ({
  text,
  payload,
}: ChatbotAssistantMessageProps) => {
  const { citations = [] } = payload?.finalResponse ?? {};
  const flattenCitations = citations.flatMap((citation) =>
    citation.references.map((reference) => reference.content.text)
  );

  return (
    <Grid
      gridDefinition={[
        { colspan: { default: 1, xxs: 1 } },
        { colspan: { default: 11, xxs: 11 } },
      ]}
    >
      <img
        alt='Assistant Avatar'
        src={assistantIcon}
        width={24}
        className='assistant-icon'
      />
      <div className='assistant-message'>
        <SpaceBetween size='s'>
          <Box
            fontSize='body-s'
            data-testid='assistant-chatbot-assistant-message'
          >
            {text}
          </Box>
          {citations.length > 0 ? (
            <ExpandableSection
              headingTagOverride='h4'
              headerText='Sources'
              headerAriaLabel='Sources'
            >
              {flattenCitations.map((citation, index) => (
                <Link
                  data-testid='assistant-chatbot-message-citation-link'
                  key={index}
                >
                  {citation}
                </Link>
              ))}
            </ExpandableSection>
          ) : null}
        </SpaceBetween>
      </div>
    </Grid>
  );
};
