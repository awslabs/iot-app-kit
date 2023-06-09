import { useCallback, useState } from 'react';

import { AppLayout } from '../../layouts/AppLayout';
import SceneViewer from '../../components/SceneViewer';
import KGComponent from '../../components/KnowledgeGraph';
import DashboardManager from '../../components/DashboardManager';
import { sceneId } from '../../configs';

import { Container, Header } from '@cloudscape-design/components';
import { NodeData, EdgeData } from '@iot-app-kit/react-components';

import { TimeSync } from '@iot-app-kit/react-components';
import { KnownComponentType, StyleTarget, useSceneComposerApi } from '@iot-app-kit/scene-composer';

const greenStyle = {
  color: 'green',
}

const redStyle = {
  color: 'red',
}

const ScenePage = () => {
  const [selectedEntityId, setSelectedEntityId] = useState('');
  const [graphEntityIds, setGraphEntityIds] = useState<string[]>([]);
  const composerApi = useSceneComposerApi(sceneId);

  const onEntitySelected1 = useCallback((e: NodeData) => {
    if (e?.entityData) {
      console.log('entity selected: ', e.entityData);
      //select is hitting before unselect currently so we need to clear last selection while we still know what it is
      if(!!selectedEntityId) {
        if (graphEntityIds.includes(selectedEntityId)) {
          composerApi.highlights([{style: greenStyle, dataBindingContext: {entityId: e.entityData.entityId}}])
        } else {
          composerApi.clearHighlights([{entityId: selectedEntityId}]);
        }
      }
      setSelectedEntityId(e.entityData.entityId);
      composerApi.setSelectedSceneNodeRef(composerApi.findSceneNodeRefBy({entityId: e.entityData.entityId}, [KnownComponentType.DataBinding])[0])
      composerApi.highlights([{
        style: redStyle,
        dataBindingContext: {
          entityId: e.entityData.entityId,
        },
      }]);
      
    }
  }, [setSelectedEntityId, composerApi, graphEntityIds, selectedEntityId]);

  const onEntityUnSelected1 = useCallback((e: NodeData) => {
    if (e?.entityData) {
      console.log('entity unselected: ', e.entityData);
      //remove select highlight
      if (graphEntityIds.includes(e.entityData.entityId)) {
        composerApi.highlights([{style: greenStyle, dataBindingContext: {entityId: e.entityData.entityId}}])
      } else if(selectedEntityId === e.entityData.entityId) {
        setSelectedEntityId('');
        composerApi.clearHighlights([{entityId: e.entityData.entityId}]);
      } 
    }
  }, [setSelectedEntityId, selectedEntityId, composerApi, graphEntityIds]);

  const onClearGraph = useCallback((nodes: NodeData[], edges?: EdgeData[]) => {
    if (nodes) {
      const contextList:unknown[] = [];
      nodes.forEach((node) => {
        console.log(JSON.stringify(node.entityData))

        if (!!node.entityData?.entityId) {
          contextList.push({entityId: node.entityData.entityId})
        }
      });
      if (contextList.length > 0) {
        composerApi.clearHighlights(contextList);
      }
    }
    if (edges) {
      edges.forEach((edge) => console.log(JSON.stringify(edge.id)));
    }
  }, [composerApi, selectedEntityId]);

  const onGraphResultChange = useCallback((nodes: NodeData[], edges?: EdgeData[]) => {
    const newResultIds: string[] = [];
    if (nodes) {
      const highlightList: StyleTarget[] = [];
      nodes.forEach((node) => {
        console.log('onGraphResultChange -----------', JSON.stringify(node.entityData))
        if (!!node.entityData?.entityId) {
          newResultIds.push(node.entityData.entityId);
          if (selectedEntityId !== node.entityData?.entityId && 
            !graphEntityIds.includes(node.entityData?.entityId)  
          ) {
            highlightList.push({
              style: greenStyle,
              dataBindingContext: {
                entityId: node.entityData?.entityId,
              },
            });
          }
        }
      });
      if(highlightList.length > 0) {
        composerApi.highlights(highlightList);
      }
    }
    // right now new search doesn't trigger clear so we have
    // to manually clear
    const clearList: unknown[] = []
    graphEntityIds.forEach((entityId) => {
      if (!newResultIds.includes(entityId)) {
        clearList.push({entityId: entityId})
        //if not on the new graph screen clear the selection
        if (selectedEntityId === entityId) {
          setSelectedEntityId('');
        }
      }
    })
    if (clearList.length > 0 ) {
      composerApi.clearHighlights(clearList);
    }
    setGraphEntityIds(newResultIds);
    if (edges) {
      edges.forEach((edge) => console.log('onGraphResultChange -----------', JSON.stringify(edge.id)));
    }
  }, [composerApi, setGraphEntityIds, selectedEntityId, setSelectedEntityId, graphEntityIds]);

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
