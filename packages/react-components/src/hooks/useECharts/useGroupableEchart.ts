import { useEffect } from 'react';
import { connect } from 'echarts';
import type { ECharts } from 'echarts';

/**
 * hook to update a group on an echarts instance
 *
 * @param chartRef React ref to an initialized echarts object
 * @param groupId - set a group on an echarts instance
 * @returns void
 */
export const useGroupableEChart = (chartRef: React.MutableRefObject<ECharts | null>, groupId?: string) => {
  useEffect(() => {
    if (groupId && chartRef.current) {
      chartRef.current.group = groupId;
      connect(groupId);
    }
  }, [groupId]);
};
