import React, { FC, useCallback, useState } from 'react';

import { KnowledgeGraph as KnowledgeGraphComp, NodeData, EdgeData, IQueryData } from '@iot-app-kit/react-components';
import { dataSource } from '../dataSource';
import './KnowledgeGraph.scss';

const kgDataSource = dataSource.kGDatamodule();

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
