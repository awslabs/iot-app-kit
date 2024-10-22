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
import { spaceStaticL } from '@cloudscape-design/design-tokens';
import CopyToClipboard from '@cloudscape-design/components/copy-to-clipboard';
import type { IMessage } from '../../hooks/useAssistant/types';
import { useIntl } from 'react-intl';

export interface AssistantMessageProps {
  message: IMessage;
}

export const AssistantMessage = ({ message }: AssistantMessageProps) => {
  const intl = useIntl();
  const { content: text, payload, generatedByAi } = message;
  const { output = {} } = (payload ?? {}) as ResponseStream;
  const { citations = [] } = output;
  const filteredCitations = citations.filter(
    ({ reference }) => !!reference?.dataset?.source?.location?.uri
  );
  // for markdown format, avoid to render H1 for better UX
  const sanitizedText = text.startsWith('# ') ? `#${text}` : text;

  return (
    <div className='assistant-message'>
      <SpaceBetween size='s'>
        <Box
          fontSize='body-m'
          data-testid='assistant-chatbot-assistant-message'
        >
          <Markdown remarkPlugins={[remarkGfm]}>{sanitizedText}</Markdown>
          {generatedByAi ? (
            <Box float='right'>
              <CopyToClipboard
                copyButtonAriaLabel={intl.formatMessage({
                  id: 'assistant-chatbot.message.copy',
                  defaultMessage: 'Copy',
                })}
                copyErrorText={intl.formatMessage({
                  id: 'assistant-chatbot.message.copyError',
                  defaultMessage: 'Failed to copy',
                })}
                copySuccessText={intl.formatMessage({
                  id: 'assistant-chatbot.message.copySuccess',
                  defaultMessage: 'Content copied',
                })}
                textToCopy={text}
                variant='icon'
              />
            </Box>
          ) : null}
        </Box>
        {filteredCitations.length > 0 ? (
          <ExpandableSection
            headingTagOverride='h4'
            headerText='Sources'
            headerAriaLabel='Sources'
          >
            <ul style={{ margin: 0, padding: `0 ${spaceStaticL}` }}>
              {filteredCitations.map((citation: Citation, index: number) => {
                const citationContent = citation.content?.text ?? '-';
                return (
                  <li key={index}>
                    <Link
                      href={
                        citation.reference?.dataset?.source?.location?.uri ?? ''
                      }
                      target='_blank'
                      data-testid='assistant-chatbot-message-citation-link'
                      key={index}
                      external
                    >
                      {citationContent.substring(0, 50)}
                      {citationContent.length > 50 ? '...' : ''}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </ExpandableSection>
        ) : null}
      </SpaceBetween>
    </div>
  );
};
