import * as React from 'react';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';
import type {
  Citation,
  ResponseStream,
} from '@amzn/iot-black-pearl-internal-v3';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface AssistantMessageProps {
  text: string;
  payload?: ResponseStream;
}

export const AssistantMessage = ({ text, payload }: AssistantMessageProps) => {
  const { output = {} } = payload ?? {};
  const { citations = [] } = output;
  const filteredCitations = citations.filter(
    ({ reference }) => !!reference?.dataset?.source?.location?.uri
  );

  return (
    <div className='assistant-message'>
      <SpaceBetween size='s'>
        <Box
          fontSize='body-m'
          data-testid='assistant-chatbot-assistant-message'
        >
          <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
        </Box>
        {filteredCitations.length > 0 ? (
          <ExpandableSection
            headingTagOverride='h4'
            headerText='Sources'
            headerAriaLabel='Sources'
          >
            {filteredCitations.map((citation: Citation, index: number) => (
              <Link
                href={citation.reference?.dataset?.source?.location?.uri ?? ''}
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
  );
};
