import Box from '@cloudscape-design/components/box';
import React from 'react';
import useDataStore from '../../../store';
import { formatDate } from '../../../utils/time';

export const TooltipDate = ({ date }: { date: string }) => {
  const timeZone = useDataStore().timeZone;

  // Date comes from axis string so need to parse
  const parsedDate = Date.parse(date);
  const formattedDate = formatDate(parsedDate, {
    pattern: 'yyyy-MM-dd hh:mm:ss',
    timeZone,
  });

  return <Box fontWeight='bold'>{formattedDate}</Box>;
};
