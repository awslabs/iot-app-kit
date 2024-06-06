import React, { createContext, useContext } from 'react';

import { utcToZonedTime, format } from 'date-fns-tz';
import { FULL_DATE_TIME } from '../../utils/time';

// https://date-fns.org/v3.6.0/docs/Time-Zones#date-fns-tz
// converts a utc date to a formatted string in a specific timeZone
export const formatDate = (
  dateTime: number,
  { timeZone, pattern }: { timeZone: string; pattern: string }
) => {
  const zonedDate = utcToZonedTime(new Date(dateTime).toISOString(), timeZone);
  const formattedDate = format(zonedDate, pattern, { timeZone: timeZone });

  return formattedDate;
};

// Helper components for use in a React Context
export type DateTimeFormatContextOptions = {
  timeZone: string;
};
export const DateTimeFormatContext =
  createContext<DateTimeFormatContextOptions>({
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

export type DateTimeOptions = {
  dateTime: number;
  pattern?: string;
};
export const DateTime = ({ dateTime, pattern }: DateTimeOptions) => {
  const formattedDate = useDateTime(dateTime, pattern);

  return <>{formattedDate}</>;
};

export const useDateTime = (dateTime: number, pattern?: string) => {
  const dateTimeFormatPattern = pattern ?? FULL_DATE_TIME;
  const { timeZone } = useContext(DateTimeFormatContext);
  return formatDate(dateTime, {
    timeZone,
    pattern: dateTimeFormatPattern,
  });
};
