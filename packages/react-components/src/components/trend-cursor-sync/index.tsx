import React, { Children, cloneElement, isValidElement, ReactElement, useEffect, useRef } from 'react';
import { connect, disconnect } from 'echarts';
import { v4 as uuid } from 'uuid';
import useDataStore from '../../store';

export interface TrendCursorProps {
  children: ReactElement | ReactElement[];
  groupId?: string;
}

const TrendCursorSync: React.FC<TrendCursorProps> = ({ children, groupId }) => {
  const internalGroupId = useRef<string>(groupId ?? uuid());
  const addTrendCursorsGroup = useDataStore((state) => state.addTrendCursorsGroup);
  useEffect(() => {
    connect(internalGroupId.current);

    // create a new group in the state
    addTrendCursorsGroup(internalGroupId.current);

    return () => {
      disconnect(internalGroupId.current);
    };
  }, [groupId]);

  if (isValidElement(children)) {
    return <>{cloneElement(children as ReactElement, { groupId: internalGroupId.current })}</>;
  } else {
    const childrenWithProps = Children.map(children as ReactElement[], (child: ReactElement<{ groupId: string }>) => {
      return cloneElement(child, { groupId: internalGroupId.current });
    });
    return <>{childrenWithProps}</>;
  }
};

export default TrendCursorSync;
