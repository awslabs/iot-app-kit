import React from 'react';
import { Box, SpaceBetween } from '@cloudscape-design/components';
import { AlarmContent } from './types';
import { AlarmStateTextCustomIcon } from '../alarm-state/alarmStateTextCustomIcon';

export interface AlarmContentContainerProps {
  alarmContent?: AlarmContent;
}

export const AlarmContentContainer = ({
  alarmContent,
}: AlarmContentContainerProps) => {
  const title = (
    <AlarmStateTextCustomIcon
      alarmState={alarmContent?.alarmState}
      alarmName={alarmContent?.alarmName}
    />
  );

  const ruleExpression = (
    <Box color='text-body-secondary' fontWeight='light'>
      {alarmContent?.alarmExpression
        ? `Rule expression: ${alarmContent?.alarmExpression}`
        : ''}
    </Box>
  );

  const severity = (
    <Box color='text-body-secondary' fontWeight='light'>
      {alarmContent?.severity ? `Severity: ${alarmContent?.severity}` : ''}
    </Box>
  );

  const content = (
    <div className='alarm-content-container'>
      <SpaceBetween direction='vertical' size='xs'>
        {title}
        {severity}
        {ruleExpression}
      </SpaceBetween>
    </div>
  );

  return content;
};
