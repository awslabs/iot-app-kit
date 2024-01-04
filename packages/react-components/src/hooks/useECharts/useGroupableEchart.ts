import React, { useEffect } from 'react';
import { connect, disconnect, type ECharts } from 'echarts';

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
      disconnect(groupId);
      connect(groupId);
    }
  }, [chartRef, groupId]);
};
