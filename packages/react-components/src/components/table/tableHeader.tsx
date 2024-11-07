import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Header from '@cloudscape-design/components/header';
import Popover from '@cloudscape-design/components/popover';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import type { FunctionComponent } from 'react';
import { useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import type { AssistantProperty } from '../../common/assistantProps';
import { Title } from '../../common/title';
import { ASSISTANT_SELECTION_LIMITATION } from './constants';

type TableHeaderProps = {
  selectedItems: number;
  totalItems: number;
  titleText?: string;
  assistant?: AssistantProperty;
  onSummarize?: () => void;
};

export const TableHeader: FunctionComponent<TableHeaderProps> = ({
  titleText,
  assistant,
  selectedItems,
  totalItems,
  onSummarize,
}: TableHeaderProps) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const counter = selectedItems
    ? `(${selectedItems}/${totalItems})`
    : `(${totalItems})`;

  useEffect(() => {
    if (triggerRef && triggerRef.current) {
      triggerRef.current.click();
    }
  }, []);

  const renderAssistantSelectionLimitation = () => {
    if (selectedItems < ASSISTANT_SELECTION_LIMITATION) {
      return null;
    }

    return (
      <Box color='text-status-error'>
        <Popover
          dismissButton={true}
          header='Property Selection Limit'
          position='left'
          triggerType='custom'
          wrapTriggerText={false}
          content={
            <FormattedMessage
              id='table-header.propertySelectionLimit'
              defaultMessage={`For optimal AI summary results, please select up to ${ASSISTANT_SELECTION_LIMITATION} properties from the table below.`}
              values={{ limit: ASSISTANT_SELECTION_LIMITATION }}
            />
          }
        >
          <div ref={triggerRef}>
            <StatusIndicator type='warning'></StatusIndicator>
          </div>
        </Popover>
      </Box>
    );
  };

  return (
    <SpaceBetween direction='vertical' size='s'>
      <Header
        actions={
          assistant ? (
            <>
              {renderAssistantSelectionLimitation()}
              <Button
                iconName='gen-ai'
                disabled={selectedItems === 0 || !assistant.enabled}
                onClick={onSummarize}
                ariaLabel='Generate Summary'
              >
                Generate Summary
              </Button>
            </>
          ) : null
        }
      >
        {titleText ? (
          <Title text={`${titleText} ${counter}`} style={{ padding: 0 }} />
        ) : null}
      </Header>
    </SpaceBetween>
  );
};
