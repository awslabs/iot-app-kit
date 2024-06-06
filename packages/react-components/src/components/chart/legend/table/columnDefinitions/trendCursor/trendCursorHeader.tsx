import React from 'react';
import { parse, format } from 'date-fns';
import { useDateTime } from '../../../../../timeZone';
import { FULL_DATE_TIME } from '../../../../../../utils/time';

type TrendCursorColumnHeaderOptions = {
  date: number;
  color?: string;
};

export const TrendCursorColumnHeader = ({
  date,
  color,
}: TrendCursorColumnHeaderOptions) => {
  const dateTime = useDateTime(date, FULL_DATE_TIME.replace(',', ''));
  const parsedDate = parse(dateTime, 'dd/MM/yyyy HH:mm:ss', new Date());
  return (
    <div className='base-chart-legend-tc-header-container'>
      <div>
        <span>{format(parsedDate, 'dd/MM/yyyy')}</span>
        <br />
        <span>{format(parsedDate, 'hh:mm:ss')}</span>
      </div>
      <div
        className='base-chart-legend-tc-header-color'
        style={{ backgroundColor: color ?? 'black' }}
      />
    </div>
  );
};
