import React, { useState } from 'react';

import { AppLayout } from '../../layouts/AppLayout';
import SceneViewer from '../../components/SceneViewer';
import KGComponent from '../../components/KnowledgeGraph';
import { Square } from '../../components/Square';
import DashboardManager from '../../components/DashboardManager';
import ViewportControls from '../../components/ViewPort/Controls';

import { Container, Header, SpaceBetween } from '@cloudscape-design/components';
import { NodeData, EdgeData, IQueryData } from '@iot-app-kit/react-components';

import { TimeSync } from '@iot-app-kit/react-components';

const ScenePage = () => {
  function onEntitySelected1(e: NodeData) {
    if (e?.entityData) {
      console.log(e.entityData);
    }
  }
  function onEntityUnSelected1(e: NodeData) {
    if (e?.entityData) {
      console.log(e.entityData);
    }
  }
  function onClearGraph(nodes: NodeData[], edges?: EdgeData[]) {
    if (nodes) {
      nodes.forEach((node) => console.log(JSON.stringify(node.entityData)));
    }
    if (edges) {
      edges.forEach((edge) => console.log(JSON.stringify(edge.id)));
    }
  }
  function onGraphResultChange(nodes: NodeData[], edges?: EdgeData[]) {
    if (nodes) {
      nodes.forEach((node) => console.log('onGraphResultChange -----------', JSON.stringify(node.entityData)));
    }
    if (edges) {
      edges.forEach((edge) => console.log('onGraphResultChange -----------', JSON.stringify(edge.id)));
    }
  }

  return (
    <AppLayout>
      {/* <SpaceBetween direction='horizontal' size={'xl'}> */}
      <TimeSync group={'main'}>
        <DashboardManager>
          <Container header={<Header>Scene</Header>}>
            <div style={{ height: '864px', position: 'relative' }}>
              <SceneViewer />
            </div>
          </Container>
          <Container>
            <KGComponent
              onEntitySelected={onEntitySelected1}
              onEntityUnSelected={onEntityUnSelected1}
              onClearGraph={onClearGraph}
              onGraphResultChange={onGraphResultChange}
            />
          </Container>
          {/* </SpaceBetween> */}
        </DashboardManager>
      </TimeSync>
    </AppLayout>
  );
};

export default ScenePage;
