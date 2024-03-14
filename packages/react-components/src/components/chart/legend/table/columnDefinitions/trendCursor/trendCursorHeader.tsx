import React from 'react';
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
  return (
    <div className='base-chart-legend-tc-header-container'>
      <div>
        <span>{dateTime.split(' ')[0]}</span>
        <br />
        <span>{dateTime.split(' ')[1]}</span>
      </div>
      <div
        className='base-chart-legend-tc-header-color'
        style={{ backgroundColor: color ?? 'black' }}
      />
    </div>
  );
};
