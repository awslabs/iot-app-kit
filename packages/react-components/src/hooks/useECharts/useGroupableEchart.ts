import { useEffect } from 'react';
import { connect } from 'echarts';
import type { ECharts } from 'echarts';
import { useViewport } from '../useViewport';

/**
 * hook to update a group on an echarts instance
 *
 * @param chartRef React ref to an initialized echarts object
 * @param groupId - set a group on an echarts instance
 * @returns void
 */
export const useGroupableEChart = (chartRef: React.MutableRefObject<ECharts | null>, groupId?: string) => {
  const { group } = useViewport();
  useEffect(() => {
    const usedGroup = groupId ?? group;
    if (usedGroup && chartRef.current) {
      chartRef.current.group = usedGroup;
      connect(usedGroup);
    }
  }, [groupId]);
};
