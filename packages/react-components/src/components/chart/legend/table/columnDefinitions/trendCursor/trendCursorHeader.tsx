import React from 'react';

type TrendCursorColumnHeaderOptions = {
  date: Date;
  color?: string;
};

export const TrendCursorColumnHeader = ({
  date,
  color,
}: TrendCursorColumnHeaderOptions) => {
  return (
    <div className='base-chart-legend-tc-header-container'>
      <div>
        <span>{date.toLocaleDateString()}</span>
        <br />
        <span>{date.toLocaleTimeString()}</span>
      </div>
      <div
        className='base-chart-legend-tc-header-color'
        style={{ backgroundColor: color ?? 'black' }}
      />
    </div>
  );
};
