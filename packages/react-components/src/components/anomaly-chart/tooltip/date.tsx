import Box from '@cloudscape-design/components/box';
import React from 'react';

export const TooltipDate = ({ date }: { date: string }) => {
  return <Box fontWeight='bold'>{date}</Box>;
};
