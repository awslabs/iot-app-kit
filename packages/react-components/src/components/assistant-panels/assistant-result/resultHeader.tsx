import { Box, Button } from '@cloudscape-design/components';
import { AssistantIcon } from '../assistantIcon';
import { colorTextHomeHeaderDefault } from '@cloudscape-design/design-tokens';
import { FormattedMessage, useIntl } from 'react-intl';

export interface ResultHeaderProps {
  headerText?: string;
  onClose: () => void;
}

export const ResultHeader = ({ headerText, onClose }: ResultHeaderProps) => {
  const intl = useIntl();
  return (
    <div
      className='action-panel-result-header'
      style={{ backgroundColor: colorTextHomeHeaderDefault }}
    >
      <div className='action-panel-result-header-icon'>
        <AssistantIcon />
      </div>
      <Box
        fontSize='body-m'
        fontWeight='bold'
        padding={{ top: 'xxs', left: 's' }}
      >
        {headerText ? (
          headerText
        ) : (
          <FormattedMessage
            id='assistant-result-panel.header'
            defaultMessage='Assistant summary result'
          />
        )}
      </Box>
      <div className='action-panel-result-header-close'>
        <Button
          iconName='close'
          variant='icon'
          onClick={onClose}
          data-testid='assistant-chatbot-close-button'
          ariaLabel={intl.formatMessage({
            id: 'assistant-result-panel.close',
            defaultMessage: 'Close',
          })}
        />
      </div>
    </div>
  );
};
