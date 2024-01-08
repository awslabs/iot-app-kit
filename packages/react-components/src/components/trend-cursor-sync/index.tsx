import React, { ReactElement, useEffect } from 'react';
import { connect, disconnect } from 'echarts';
import useDataStore from '../../store';
import { useViewport } from '../../hooks/useViewport';

export interface TrendCursorProps {
  children: ReactElement | ReactElement[];
  groupId?: string;
}

export const TrendCursorSync: React.FC<TrendCursorProps> = ({ children }) => {
  const addTrendCursorsGroup = useDataStore(
    (state) => state.addTrendCursorsGroup
  );
  const deleteTrendCursorsGroup = useDataStore(
    (state) => state.deleteTrendCursorsGroup
  );
  const { group } = useViewport();

  useEffect(() => {
    if (group) {
      connect(group);
      // create a new group in the state
      addTrendCursorsGroup(group);

      return () => {
        disconnect(group);
        deleteTrendCursorsGroup(group);
      };
    }
  }, [group, addTrendCursorsGroup, deleteTrendCursorsGroup]);

  return <>{children}</>;
};
