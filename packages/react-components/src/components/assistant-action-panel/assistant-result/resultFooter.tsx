import React from 'react';
import Button from '@cloudscape-design/components/button';
import Box from '@cloudscape-design/components/box';
import { AssistantIcon } from '../assistantIcon';
import { colorBorderDividerDefault } from '@cloudscape-design/design-tokens';
import { FormattedMessage, useIntl } from 'react-intl';

interface ResultFooterProps {
  onCopy: () => void;
  onDivedeep: () => void;
}

export const ResultFooter = ({ onCopy, onDivedeep }: ResultFooterProps) => {
  const intl = useIntl();
  return (
    <div
      className='action-panel-result-footer'
      style={{
        borderTop: `1px solid ${colorBorderDividerDefault}`,
      }}
    >
      <div className='action-panel-result-footer-actions'>
        <Button
          iconName='copy'
          variant='icon'
          onClick={onCopy}
          data-testid='action-panel-result-copy'
          ariaLabel={intl.formatMessage({
            id: 'assistant-result-panel.copy',
            defaultMessage: 'Copy',
          })}
        />
      </div>
      <button
        onClick={onDivedeep}
        data-testid='action-panel-result-divedeep'
        aria-label={intl.formatMessage({
          id: 'assistant-action-panel.deepDive',
          defaultMessage: 'Dive deep',
        })}
        className='action-panel-result-footer-divedeep'
      >
        <AssistantIcon />
        <Box variant='span' fontSize='body-m' padding={{ left: 'xxs' }}>
          <FormattedMessage
            id='assistant-action-panel.deepDive'
            description='Dive deep button to open assistant action menu'
            defaultMessage='Dive deep'
          />
        </Box>
      </button>
    </div>
  );
};
