import * as React from 'react';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import assistantIcon from '../assets/assistantIcon.svg';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';
import type {
  Citation,
  ResponseStream,
} from '@amzn/iot-black-pearl-internal-v3';

export interface ChatbotAssistantMessageProps {
  text: string;
  payload?: ResponseStream;
}

export const ChatbotAssistantMessage = ({
  text,
  payload,
}: ChatbotAssistantMessageProps) => {
  const { output = {} } = payload ?? {};
  const { citations = [] } = output;
  const filteredCitations = citations.filter(
    ({ reference }) => !!reference?.dataset?.source?.location?.uri
  );
  const hasBreakingLines = text.match(/\r|\n/);

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
            {hasBreakingLines ? (
              <pre style={{ whiteSpace: 'pre-wrap' }}>{text}</pre>
            ) : (
              text
            )}
          </Box>
          {filteredCitations.length > 0 ? (
            <ExpandableSection
              headingTagOverride='h4'
              headerText='Sources'
              headerAriaLabel='Sources'
            >
              {filteredCitations.map((citation: Citation, index: number) => (
                <Link
                  href={
                    citation.reference?.dataset?.source?.location?.uri ?? ''
                  }
                  target='_blank'
                  data-testid='assistant-chatbot-message-citation-link'
                  key={index}
                >
                  {citation.content?.text ?? '-'}
                </Link>
              ))}
            </ExpandableSection>
          ) : null}
        </SpaceBetween>
      </div>
    </Grid>
  );
};
