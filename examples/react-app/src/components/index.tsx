import React, { useCallback, useState } from 'react';

import { SceneViewer as SceneViewerComp } from '@iot-app-kit/scene-composer';
import { sceneId, componentTypeQueries, viewport, entityQueries, dataBindingTemplate } from '../configs';
import { KnowledgeGraph, NodeData, EdgeData, IQueryData } from '@iot-app-kit/react-components';
import { Container, Header, SpaceBetween } from '@cloudscape-design/components';
import { dataSource } from '../dataSource';
import { KnownComponentType, StyleTarget, useSceneComposerApi } from '@iot-app-kit/scene-composer';
import '../App.css';

const greenStyle = {
  color: 'green',
};

const redStyle = {
  color: 'red',
};

const kgDataSource = dataSource.kGDatamodule();

const sceneLoader = dataSource.s3SceneLoader(sceneId);

const queries = [
  ...componentTypeQueries.map((q) => dataSource.query.timeSeriesData(q)),
  ...entityQueries.map((q) => dataSource.query.timeSeriesData(q)),
];

const KGSceneIntegration = () => {
  const [selectedEntityId, setSelectedEntityId] = useState('');
  const [graphEntityIds, setGraphEntityIds] = useState<string[]>([]);
  const [queryData, setQueryData] = useState<IQueryData | null>(null);
  const composerApi = useSceneComposerApi(sceneId);
  //let queryData : IQueryData | null = null;

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
      if (e.additionalComponentData && e.additionalComponentData[0]?.dataBindingContext?.entityId) {
        const entityId = e.additionalComponentData[0].dataBindingContext.entityId;
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
    <Container>
      <SpaceBetween direction='horizontal' size={'xl'}>
        <Container header={<Header>Scene</Header>}>
          <div className='SceneViewer'>
            <SceneViewerComp
              sceneComposerId={sceneId}
              sceneLoader={sceneLoader}
              config={{
                dracoDecoder: {
                  enable: true,
                  path: 'https://www.gstatic.com/draco/versioned/decoders/1.5.3/', // path to the draco files
                },
              }}
              onSelectionChanged={onSelectionChanged}
              onWidgetClick={onWidgetClick}
              queries={queries}
              viewport={viewport}
              dataBindingTemplate={dataBindingTemplate}
            />
          </div>
        </Container>
        <Container>
          <div className='KnowledgeGraphComponent'>
            <KnowledgeGraph
              kgDataSource={kgDataSource}
              onEntitySelected={onEntitySelected}
              onEntityUnSelected={onEntityUnSelected}
              onClearGraph={onClearGraph}
              onGraphResultChange={onGraphResultChange}
              queryData={queryData}
            />
          </div>
        </Container>
      </SpaceBetween>
    </Container>
  );
};

export default KGSceneIntegration;
