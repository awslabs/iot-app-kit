import * as React from 'react';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import assistantIcon from '../assets/assistantIcon.svg';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';

export interface ChatbotAssistantMessageProps {
  text: string;
  citations: Array<string>;
}

export const ChatbotAssistantMessage = ({
  text,
  citations,
}: ChatbotAssistantMessageProps) => {
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
          <Box fontSize='body-s'>{text}</Box>
          {citations.length > 0 ? (
            <ExpandableSection
              headingTagOverride='h4'
              headerText='Sources'
              headerAriaLabel='Sources'
            >
              {citations.map((citation) => (
                <Link>{citation}</Link>
              ))}
            </ExpandableSection>
          ) : null}
        </SpaceBetween>
      </div>
    </Grid>
  );
};
