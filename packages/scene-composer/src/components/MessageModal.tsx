import _ from 'lodash';
import { Box, Button, Header, Icon, SpaceBetween, StatusIndicator, TextContent } from '@awsui/components-react';
import React, { Fragment, useContext, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { AWS_USER_GUIDE_DOC_URL } from '../common/constants';
import { sceneComposerIdContext } from '../common/sceneComposerIdContext';
import { useStore } from '../store';
import { DisplayMessageCategory } from '../store/internalInterfaces';
import { evalStringTemplate } from '../utils/stringUtils';

import CenteredContainer from './CenteredContainer';

function mapMessageCategoryToModalTitle(category: DisplayMessageCategory) {
  const intl = useIntl();
  switch (category) {
    case DisplayMessageCategory.Error:
      return intl.formatMessage({ defaultMessage: 'Error - unable to render the scene', description: 'Error message' });
    case DisplayMessageCategory.Warning:
      return intl.formatMessage({ defaultMessage: 'Warning', description: 'Warning message' });
    default:
      return intl.formatMessage({ defaultMessage: 'Notice', description: 'Notice message' });
  }
}

const MessageModal = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const messages = useStore(sceneComposerId)((state) => state.getMessages());
  const clearMessages = useStore(sceneComposerId)((state) => state.clearMessages);
  const intl = useIntl();

  const containsError = messages.find((m) => m.category === DisplayMessageCategory.Error);
  const containsWarning = messages.find((m) => m.category === DisplayMessageCategory.Warning);

  const title = containsError
    ? mapMessageCategoryToModalTitle(DisplayMessageCategory.Error)
    : containsWarning
    ? mapMessageCategoryToModalTitle(DisplayMessageCategory.Warning)
    : mapMessageCategoryToModalTitle(DisplayMessageCategory.Info);
  const allowDismiss = !containsError;
  const showUserGuideLink = containsError || containsWarning;

  const messageContent = useMemo(() => {
    const groupedMessages = _.groupBy(messages, (m) => m.category);
    return [DisplayMessageCategory.Error, DisplayMessageCategory.Warning, DisplayMessageCategory.Info]
      .map((category) => {
        if (category in groupedMessages) {
          const messages = groupedMessages[category];
          if (messages.length === 0) {
            return null;
          }
          return (
            <Fragment key={category}>
              {messages.map((m, index) => (
                <StatusIndicator key={index} type={category.toLocaleLowerCase() as any}>
                  {evalStringTemplate(m.messageText, m.params)}
                  {m.params?.cause ? ' Cause - ' + m.params.cause : ''}
                </StatusIndicator>
              ))}
            </Fragment>
          );
        } else {
          return null;
        }
      })
      .filter((m) => m !== null);
  }, [messages]);

  return (
    <CenteredContainer
      header={<Header variant='h2'>{title}</Header>}
      footer={
        allowDismiss && (
          <Box float='right' padding={{ bottom: 's' }}>
            <Button variant='primary' onClick={clearMessages}>
              Ok
            </Button>
          </Box>
        )
      }
    >
      <SpaceBetween size='s'>
        <Box>{messageContent}</Box>

        {showUserGuideLink && (
          <Box>
            <TextContent>
              <p>
                <a href={AWS_USER_GUIDE_DOC_URL}>
                  {' '}
                  {intl.formatMessage({ defaultMessage: 'Learn More', description: 'Hyperlink title' })}{' '}
                  <Icon name='external' size='normal' variant='link' />{' '}
                </a>
              </p>
            </TextContent>
          </Box>
        )}
      </SpaceBetween>
    </CenteredContainer>
  );
};

MessageModal.displayName = 'MessageModal';

export default MessageModal;
