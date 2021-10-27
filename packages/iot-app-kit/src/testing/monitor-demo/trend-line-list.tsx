import { h } from '@stencil/core';
import { Trend, TREND_TYPE } from '@synchro-charts/core';

export const TrendLineListItem = ({
  dataStreamName,
  trend,
  removeTrendLine,
}: {
  dataStreamName: string;
  trend: Trend;
  removeTrendLine: (dataStreamId: string, trendType: TREND_TYPE) => void;
}) => {
  return (
    <tr key={`${trend.dataStreamId}---${trend.type}`} class="trend-line-list-item-container">
      <td class="color-container">
        <div class="color-block" style={{ background: trend.color }} />
      </td>
      <td>{dataStreamName}</td>
      <td>
        <button onClick={() => removeTrendLine(trend.dataStreamId, trend.type)}>
          <strong>X</strong>
        </button>
      </td>
    </tr>
  );
};
