import * as React from 'react';
import { ResponseStreamChunk } from '@iot-app-kit/core-util';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import assistantIcon from '../assets/assistantIcon.svg';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { FinalResponse } from '@amzn/iot-black-pearl-internal-v3';

export interface ChatbotAssistantMessageProps {
  text: string;
  payload?: ResponseStreamChunk;
}

interface Reference {
  location?: {
    s3Location?: {
      uri: string;
    };
  };
}

interface Citation {
  references: Array<Reference>;
}

type Citations = FinalResponse & {
  citations?: Citation[];
};

export const ChatbotAssistantMessage = ({
  text,
  payload,
}: ChatbotAssistantMessageProps) => {
  const { finalResponse = {} } = payload ?? {};
  const { citations = [] } = finalResponse as Citations;
  const references = citations
    .flatMap(({ references }: Citation) => references)
    .filter((reference: Reference) => !!reference.location?.s3Location?.uri);
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
          {references.length > 0 ? (
            <ExpandableSection
              headingTagOverride='h4'
              headerText='Sources'
              headerAriaLabel='Sources'
            >
              {references.map((reference: any, index: number) => (
                <Link
                  href={reference.location?.s3Location?.uri ?? ''}
                  target='_blank'
                  data-testid='assistant-chatbot-message-citation-link'
                  key={index}
                >
                  {reference.content?.text ?? '-'}
                </Link>
              ))}
            </ExpandableSection>
          ) : null}
        </SpaceBetween>
      </div>
    </Grid>
  );
};
