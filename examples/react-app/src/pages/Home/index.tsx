import { useCallback, useState } from 'react';

import { sceneId } from '../../configs';
import { AppLayout } from '../../layouts/AppLayout';
import SceneViewer from '../../components/SceneViewer';
import VideoPlayer from '../../components/VideoPlayer';
import DashboardManager from '../../components/DashboardManager';
import KnowledgeGraph from '../../components/KnowledgeGraph';
import LineChart from '../../components/LineChart';

import { Container, Header, SpaceBetween } from '@cloudscape-design/components';

import { TimeSync, NodeData, EdgeData, IQueryData, TimeSelection } from '@iot-app-kit/react-components';
import { KnownComponentType, StyleTarget, useSceneComposerApi } from '@iot-app-kit/scene-composer';

const greenStyle = {
  color: 'green',
};

const redStyle = {
  color: 'red',
};

const ScenePage = () => {
  const [selectedEntityId, setSelectedEntityId] = useState<string>('');
  const [graphEntityIds, setGraphEntityIds] = useState<string[]>([]);
  const [queryData, setQueryData] = useState<IQueryData | null>(null);
  const composerApi = useSceneComposerApi(sceneId);

  const onEntitySelected = useCallback(
    (e: NodeData) => {
      if (e?.entityData) {
        const entityId = e.entityData.entityId;
        // clear old select
        if (graphEntityIds.includes(selectedEntityId)) {
          composerApi.highlights([{ style: greenStyle, dataBindingContext: { entityId: selectedEntityId } }]);
        } else if (selectedEntityId === entityId) {
          composerApi.clearHighlights([{ entityId: selectedEntityId }]);
        }
        // set new select
        const nodeRefs = composerApi.findSceneNodeRefBy({ entityId: entityId }, [
          KnownComponentType.EntityBinding,
        ]);
        composerApi.setSelectedSceneNodeRef(nodeRefs[0]);
        composerApi.highlights([
          {
            style: redStyle,
            dataBindingContext: {
              entityId: entityId,
            },
          },
        ]);
        composerApi.setCameraTarget(nodeRefs[0], 'transition');
        setSelectedEntityId(e.entityData.entityId);
      }
    },
    [setSelectedEntityId, composerApi, graphEntityIds, selectedEntityId]
  );

  const onEntityUnSelected = useCallback(
    (e: NodeData) => {
      if (e?.entityData) {
        //remove select highlight
        if (graphEntityIds.includes(e.entityData.entityId)) {
          composerApi.highlights([{ style: greenStyle, dataBindingContext: { entityId: e.entityData.entityId } }]);
        } else if (selectedEntityId === e.entityData.entityId) {
          setSelectedEntityId('');
          composerApi.clearHighlights([{ entityId: e.entityData.entityId }]);
        }
      }
    },
    [setSelectedEntityId, selectedEntityId, composerApi, graphEntityIds]
  );

  const onClearGraph = useCallback(
    (nodes: NodeData[], edges?: EdgeData[]) => {
      if (nodes) {
        const contextList: unknown[] = [];
        nodes.forEach((node) => {
          if (!!node.entityData?.entityId) {
            contextList.push({ entityId: node.entityData.entityId });
          }
        });
        if (contextList.length > 0) {
          composerApi.clearHighlights(contextList);
        }
      }
    },
    [composerApi]
  );

  const onGraphResultChange = useCallback(
    (nodes: NodeData[], edges?: EdgeData[]) => {
      const newResultIds: string[] = [];
      if (nodes) {
        const highlightList: StyleTarget[] = [];
        nodes.forEach((node) => {
          if (!!node.entityData?.entityId) {
            const entityId = node.entityData?.entityId
            newResultIds.push(entityId);
            if (!graphEntityIds.includes(entityId) && selectedEntityId !== entityId) {
              highlightList.push({
                style: greenStyle,
                dataBindingContext: {
                  entityId: entityId,
                },
              });
            } else if (selectedEntityId === entityId) {
              highlightList.push({
                style: redStyle,
                dataBindingContext: {
                  entityId: entityId
                },
              });
            }
          }
        });
        if (highlightList.length > 0) {
          composerApi.highlights(highlightList);
        }
      }
      // right now new search doesn't trigger clear so we have
      // to manually clear
      const clearList: unknown[] = [];
      graphEntityIds.forEach((entityId) => {
        if (!newResultIds.includes(entityId)) {
          clearList.push({ entityId: entityId });
          //if not on the new graph screen clear the selection
          if (selectedEntityId === entityId) {
            setSelectedEntityId('');
          }
        }
      });
      if (clearList.length > 0) {
        composerApi.clearHighlights(clearList);
      }
      setGraphEntityIds(newResultIds);
    },
    [composerApi, setGraphEntityIds, selectedEntityId, setSelectedEntityId, graphEntityIds]
  );

  const onSelectionChanged = useCallback(
    (e: any) => {
      if (e.additionalComponentData && e.componentTypes) {
        let entityId = selectedEntityId;
        const entityIndex = e.componentTypes.findIndex((component: string) => component === 'EntityBinding')
        const tagIndex = e.componentTypes.findIndex((component: string) => component === 'Tag')
        if (e.additionalComponentData[entityIndex]?.dataBindingContext?.entityId) {
          entityId = e.additionalComponentData[entityIndex].dataBindingContext.entityId;
        } else if (e.additionalComponentData[tagIndex]?.dataBindingContext?.entityId) {
          entityId = e.additionalComponentData[tagIndex].dataBindingContext.entityId;
        }
        if (selectedEntityId !== entityId) {
          const query: IQueryData = { entityId: entityId };
          setSelectedEntityId(entityId);
          setQueryData(query);
        }
      }
    },
    [setQueryData, setSelectedEntityId, selectedEntityId]
  );

  const onWidgetClick = useCallback((e: any) => {
    console.log('onWidgetClick event fired with data: ', e);
  }, []);

  return (
    <AppLayout>
      <TimeSync group={'main'}>
        <DashboardManager>
          <SpaceBetween size={'s'}>
            <Container>
              <TimeSelection />
            </Container>
            <Container>
              <LineChart entityId={selectedEntityId} />
            </Container>
            <Container header={<Header>Scene</Header>}>
              <SceneViewer onSelectionChanged={onSelectionChanged} onWidgetClick={onWidgetClick} />
            </Container>
            <Container>
              <KnowledgeGraph
                queryData={queryData}
                onEntitySelected={onEntitySelected}
                onEntityUnSelected={onEntityUnSelected}
                onClearGraph={onClearGraph}
                onGraphResultChange={onGraphResultChange}
              />
            </Container>
            <Container header={<Header>Video Player</Header>}>
              <VideoPlayer />
            </Container>
          </SpaceBetween>
        </DashboardManager>
      </TimeSync>
    </AppLayout>
  );
};

export default ScenePage;
