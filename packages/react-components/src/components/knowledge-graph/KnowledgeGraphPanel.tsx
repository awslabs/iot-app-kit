/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  HTMLAttributes,
  useEffect,
  useCallback,
  useMemo,
  useState,
  useRef,
} from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl';
import type { Core, EventObjectNode, EventObjectEdge } from 'cytoscape';
import {
  Button,
  Input,
  Grid,
  SpaceBetween,
} from '@cloudscape-design/components';
import { TwinMakerKGQueryDataModule } from '@iot-app-kit/source-iottwinmaker';
import GraphView from './graph/graph-view';
import Toolbar from './graph/graph-toolbar';
import './graph/styles.scss';
import './styles.scss';
import { STYLE_PREFIX } from './graph/constants';
import useStylesheet from './graph/cytoscape-cloudscape-theme';
import StateManager, { useKnowledgeGraphState } from './StateManager';
import { createKnowledgeGraphQueryClient } from './KnowledgeGraphQueries';
import { ResponseParser } from './responseParser';
import { NodeData, EdgeData } from './graph/types';
import { IQueryData } from './interfaces';
import { getElementsDefinition } from './utils';

export interface KnowledgeGraphInterface
  extends HTMLAttributes<HTMLDivElement> {
  kgDataSource: TwinMakerKGQueryDataModule;
  onEntitySelected?: (e: NodeData) => void;
  onRelationshipSelected?: (e: EdgeData) => void;
  onEntityUnSelected?: (e: NodeData) => void;
  onRelationshipUnSelected?: (e: EdgeData) => void;
  onGraphResultChange?: (nodes: NodeData[], edges?: EdgeData[]) => void;
  onClearGraph?: (nodes: NodeData[], edges?: EdgeData[]) => void;
  queryData?: IQueryData | null;
}
export const ZOOM_INTERVAL = 0.1;

export const KnowledgeGraphContainer: React.FC<KnowledgeGraphInterface> = ({
  kgDataSource,
  className,
  onEntitySelected,
  onRelationshipSelected,
  onEntityUnSelected,
  onRelationshipUnSelected,
  onGraphResultChange,
  onClearGraph,
  queryData,
  ...props
}) => {
  const defaultLayoutOptions = {
    spacingFactor: 0.4,
    animate: false,
    fit: false,
    padding: 30,
    nodeDimensionsIncludeLabels: false,
    randomize: false,
    componentSpacing: 40,
    nodeRepulsion: function (_node: any) {
      return 2048;
    },
    nodeOverlap: 4,
    edgeElasticity: function (_edge: any) {
      return 32;
    },
    nestingFactor: 1.2,
    gravity: 1,
    initialTemp: 1000,
    coolingFactor: 0.99,
    minTemp: 1.0,
  };
  const breadthFirstlayout = {
    ...defaultLayoutOptions,
    name: 'breadthfirst',
  };
  const gridlayout = {
    ...defaultLayoutOptions,
    name: 'grid',
    fit: true,
    padding: 50,
  };
  const presetlayout = {
    ...defaultLayoutOptions,
    name: 'preset',
    zoom: 5,
  };

  const cy = useRef<Core>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stylesheet = useStylesheet(containerRef);
  const {
    selectedGraphNodeEntityId,
    setSelectedGraphNodeEntityId,
    setQueryResult,
    queryResult,
    clearGraphResults,
  } = useKnowledgeGraphState();
  const [searchTerm, setSearchTerm] = useState('');
  const { nodeData, edgeData } = ResponseParser.parse(
    queryResult ? queryResult['rows'] : null,
    queryResult ? queryResult['columnDescriptions'] : null
  );

  const fit = useCallback(() => {
    cy.current?.fit();
  }, []);

  const center = useCallback(() => {
    cy.current?.center();
  }, []);

  const zoomIn = useCallback(() => {
    cy.current?.zoom({
      level: cy.current.zoom() + ZOOM_INTERVAL,
      renderedPosition: {
        x: cy.current.width() / 2,
        y: cy.current.height() / 2,
      },
    });
  }, []);

  const zoomOut = useCallback(() => {
    cy.current?.zoom({
      level: cy.current.zoom() - ZOOM_INTERVAL,
      renderedPosition: {
        x: cy.current.width() / 2,
        y: cy.current.height() / 2,
      },
    });
  }, []);

  // using async await here is a temprory Hack for the case when you select a node and then click another node,
  // in such a case Cytoscape fires the select event first before the unselect event of the first node.
  // We are also considering another solution mentioned here
  // https://stackoverflow.com/questions/61898195/find-selected-nodes-edges-in-cytoscape-js-onunselect-event

  const clickEntityHandler = useCallback(
    async ({ target }: EventObjectNode) => {
      const data = (await target.data()) as NodeData;
      if (onEntitySelected) {
        onEntitySelected(data);
      }
      setSelectedGraphNodeEntityId(data.id);
      console.log(
        'selectedGraphNodeEntityId Inside = ',
        selectedGraphNodeEntityId
      );
    },
    [onEntitySelected, setSelectedGraphNodeEntityId]
  );

  const clickRelationshipHandler = useCallback(
    async ({ target }: EventObjectEdge) => {
      const data = (await target.data()) as EdgeData;
      if (onRelationshipSelected) {
        onRelationshipSelected(data);
      }
    },
    [onRelationshipSelected]
  );
  const unClickEntityHandler = useCallback(
    ({ target }: EventObjectNode) => {
      const data = target.data() as NodeData;
      if (onEntityUnSelected) {
        onEntityUnSelected(data);
      }
      setSelectedGraphNodeEntityId(null);
    },
    [onEntityUnSelected, setSelectedGraphNodeEntityId]
  );

  const unClickRelationshipHandler = useCallback(
    ({ target }: EventObjectEdge) => {
      const data = target.data() as EdgeData;
      if (onRelationshipUnSelected) {
        onRelationshipUnSelected(data);
      }
    },
    [onRelationshipUnSelected]
  );

  useEffect(() => {
    cy.current?.on('click', 'node', clickEntityHandler);
    cy.current?.on('click', 'edge', clickRelationshipHandler);
    cy.current?.on('unselect', 'node', unClickEntityHandler);
    cy.current?.on('unselect', 'edge', unClickRelationshipHandler);

    return () => {
      cy.current?.off('click', 'node');
      cy.current?.off('click', 'edge');
      cy.current?.off('unselect', 'node');
      cy.current?.off('unselect', 'edge');
    };
  }, [
    cy.current,
    clickEntityHandler,
    clickRelationshipHandler,
    unClickEntityHandler,
    unClickRelationshipHandler,
  ]);

  useEffect(() => {
    if (onGraphResultChange && nodeData) {
      edgeData
        ? onGraphResultChange([...nodeData.values()], [...edgeData.values()])
        : onGraphResultChange([...nodeData.values()]);
    }
    if (nodeData.size > 1) cy.current?.fit();
    cy.current?.center();
  }, [queryResult]);

  const knowledgeGraphQueryClient = useMemo(() => {
    return createKnowledgeGraphQueryClient(kgDataSource, setQueryResult);
  }, [kgDataSource, setQueryResult]);

  const onSearchClicked = useCallback(() => {
    if (searchTerm) {
      knowledgeGraphQueryClient.findEntitiesByName(searchTerm);
    }
  }, [knowledgeGraphQueryClient, searchTerm]);

  const onExploreClicked = useCallback(() => {
    if (selectedGraphNodeEntityId) {
      knowledgeGraphQueryClient.findRelatedEntities(selectedGraphNodeEntityId);
    }
  }, [selectedGraphNodeEntityId, knowledgeGraphQueryClient]);

  const onClearClicked = useCallback(() => {
    if (onClearGraph && nodeData) {
      edgeData
        ? onClearGraph([...nodeData.values()], [...edgeData.values()])
        : onClearGraph([...nodeData.values()]);
    }
    clearGraphResults(true);
  }, [clearGraphResults, onClearGraph, nodeData, edgeData]);

  useEffect(() => {
    if (queryData?.entityId) {
      clearGraphResults(true);
      knowledgeGraphQueryClient.executeExternalEntityQuery(queryData.entityId);
    }
  }, [queryData]);

  return (
    <div className='knowledgeGraph-container'>
      <h2>Knowledge Graph</h2>
      <div className='search-bar'>
        <Grid gridDefinition={[{ colspan: 9 }, { colspan: 3 }]}>
          <Input
            type='search'
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.detail.value);
            }}
          ></Input>
          <Button onClick={onSearchClicked} data-testid='search-button'>
            <FormattedMessage
              id='KnowledgeGraphPanel.button.search'
              defaultMessage='Search'
              description='Search button text'
            />
          </Button>
        </Grid>
      </div>
      <div
        ref={containerRef}
        className={`${STYLE_PREFIX} ${className || ''}`.trim()}
        {...props}
      >
        <GraphView
          className={`${STYLE_PREFIX}-canvas`}
          ref={cy}
          stylesheet={stylesheet}
          elements={getElementsDefinition(
            [...nodeData.values()],
            [...edgeData.values()]
          )}
          layout={
            edgeData.size > 0
              ? breadthFirstlayout
              : nodeData.size > 1
              ? gridlayout
              : presetlayout
          }
        />
        <Toolbar>
          <Button
            data-testid='fit-button'
            className={`${STYLE_PREFIX}-button`}
            onClick={fit}
            iconName='zoom-to-fit'
            variant='icon'
          />
          <Button
            data-testid='center-button'
            className={`${STYLE_PREFIX}-button`}
            onClick={center}
            iconName='expand'
            variant='icon'
          />
          <Button
            data-testid='zoom-in-button'
            className={`${STYLE_PREFIX}-button`}
            onClick={zoomIn}
            iconName='zoom-in'
            variant='icon'
          />
          <Button
            data-testid='zoom-out-button'
            className={`${STYLE_PREFIX}-button`}
            onClick={zoomOut}
            iconName='zoom-out'
            variant='icon'
          />
        </Toolbar>
      </div>
      <div className='action-buttons'>
        <SpaceBetween direction='horizontal' size='s'>
          <Button
            disabled={selectedGraphNodeEntityId ? false : true}
            onClick={onExploreClicked}
            data-testid='explore-button'
          >
            <FormattedMessage
              id='KnowledgeGraphPanel.button.explore'
              defaultMessage='Explore'
              description='Explore button text'
            />
          </Button>
          <Button
            disabled={queryResult ? false : true}
            onClick={onClearClicked}
            data-testid='clear-button'
          >
            <FormattedMessage
              id='KnowledgeGraphPanel.button.clear'
              defaultMessage='Clear'
              description='Clear button text'
            />
          </Button>
        </SpaceBetween>
      </div>
    </div>
  );
};
export const KnowledgeGraph: React.FC<KnowledgeGraphInterface> = (props) => {
  return (
    <StateManager>
      {/* For the moment we're setting it to a fixed language,
      later we will determine the user's locale by evaluating the language request sent by the browser */}
      <IntlProvider locale='en' defaultLocale='en'>
        <KnowledgeGraphContainer {...props} />
      </IntlProvider>
    </StateManager>
  );
};
