import { formatDate } from '../../../../../../utils/time';
import useDataStore from '../../../../../../store';

type TrendCursorColumnHeaderOptions = {
  date: number;
  color?: string;
};

export const TrendCursorColumnHeader = ({
  date,
  color,
}: TrendCursorColumnHeaderOptions) => {
  return (
    <div className='base-chart-legend-tc-header-container'>
      <div>
        <span>
          {formatDate(date, {
            timeZone: useDataStore().timeZone,
            pattern: 'yyyy-MM-dd',
          })}
        </span>
        <br />
        <span>
          {formatDate(date, {
            timeZone: useDataStore().timeZone,
            pattern: 'hh:mm:ss aaaa',
          })}
        </span>
      </div>
      <div
        className='base-chart-legend-tc-header-color'
        style={{ backgroundColor: color ?? 'black' }}
      />
    </div>
  );
};
