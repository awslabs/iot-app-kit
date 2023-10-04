import React, { FC, useMemo } from 'react';

import { KnowledgeGraph as KnowledgeGraphComp, NodeData, EdgeData, IQueryData } from '@iot-app-kit/react-components';
import useTwinMakerDataSource from '../hooks/useTwinMakerDataSource';
import './KnowledgeGraph.scss';

interface KnowledgeGraphProps {
  onEntitySelected: (nodeData: NodeData) => void;
  onEntityUnSelected: (nodeData: NodeData) => void;
  onClearGraph: (nodes: NodeData[], edges?: EdgeData[]) => void;
  onGraphResultChange: (nodes: NodeData[], edges?: EdgeData[]) => void;
  queryData: IQueryData | null;
}

const KnowledgeGraph: FC<KnowledgeGraphProps> = ({
  onEntitySelected,
  onEntityUnSelected,
  onClearGraph,
  onGraphResultChange,
  queryData,
}) => {

  const dataSource = useTwinMakerDataSource();
  const kgDataSource = useMemo(() => (dataSource as any)?.kGDatamodule(), [dataSource]);

  return (
    <div className='KnowledgeGraph'>
      <KnowledgeGraphComp
        kgDataSource={kgDataSource}
        onEntitySelected={onEntitySelected}
        onEntityUnSelected={onEntityUnSelected}
        onClearGraph={onClearGraph}
        onGraphResultChange={onGraphResultChange}
        queryData={queryData}
      />
    </div>
  );
};

export default KnowledgeGraph;
