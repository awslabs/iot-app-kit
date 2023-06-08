import { KnowledgeGraph, NodeData, EdgeData } from '@iot-app-kit/react-components';
import { dataSource } from '../dataSource';
import React from 'react';
//import '../App.css';

const kgDataSource = dataSource.kGDatamodule();
//const queryData = undefined; //{ entityId: 'floor_8515ece3-a53c-3726-9963-07766b039ab1' };

export interface KGCInterface {
  onEntitySelected?: (e: NodeData) => void;

  onEntityUnSelected?: (e: NodeData) => void;
  onClearGraph?: (nodes: NodeData[], edges?: EdgeData[]) => void;
  onGraphResultChange?: (nodes: NodeData[], edges?: EdgeData[]) => void;
}

const KGComponent: React.FC<KGCInterface> = ({
  onEntitySelected,
  onEntityUnSelected,
  onClearGraph,
  onGraphResultChange,
}) => {
  return (
    <div className='KnowledgeGraphComponent'>
      <KnowledgeGraph
        kgDataSource={kgDataSource}
        onEntitySelected={onEntitySelected}
        onEntityUnSelected={onEntityUnSelected}
        onClearGraph={onClearGraph}
        onGraphResultChange={onGraphResultChange}
      />
    </div>
  );
};

export default KGComponent;
