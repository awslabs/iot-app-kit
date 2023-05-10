import React, { FC, HTMLAttributes, useCallback, useEffect, useRef } from 'react';
import type { Core, ElementDefinition, LayoutOptions } from 'cytoscape';
import { FitIcon, MinusIcon, PlusIcon, TargetIcon } from './lib/svgs/icons';
import Container from '@awsui/components-react/container';

import CytoscapeComponent from 'react-cytoscapejs';

import './styles.scss';

export interface CytoGraphProps extends HTMLAttributes<HTMLDivElement> {
  graphLayout?: LayoutOptions;
}

export const Graph: FC<CytoGraphProps> = ({ graphLayout, className, ...props }) => {
  const elements = [
    { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
    { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
    { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } },
  ];

  const ZOOM_INTERVAL = 1;

  const cy = useRef<Core>();

  const handleFitClick = useCallback(() => {
    cy.current?.fit();
  }, []);

  const handleCenterClick = useCallback(() => {
    cy.current?.center();
  }, []);

  const handleZoomInClick = useCallback(() => {
    cy.current?.zoom(cy.current.zoom() + ZOOM_INTERVAL);
  }, []);

  const handleZoomOutClick = useCallback(() => {
    cy.current?.zoom(cy.current.zoom() - ZOOM_INTERVAL);
  }, []);

  useEffect(() => {
    cy.current?.resize();
    cy.current?.center();
  }, []);

  return (
    <Container className={`ak-graph ${className}`.trim()} {...props}>
      <CytoscapeComponent
        cy={(c) => (cy.current = c)}
        layout={graphLayout}
        elements={elements as ElementDefinition[]}
        style={{ width: '100vw', height: '100vh' }}
      />
      <div className='ak-graph-controls'>
        <button className='ak-graph-button' onPointerDown={handleFitClick}>
          <FitIcon className='ak-graph-buttonFitIcon' />
        </button>
        <button className='ak-graph-button' onPointerDown={handleCenterClick}>
          <TargetIcon className='ak-graph-buttonCenterIcon' />
        </button>
        <button className='ak-graph-button' onPointerDown={handleZoomInClick}>
          <PlusIcon className='ak-graph-buttonZoomInIcon' />
        </button>
        <button className='ak-graph-button' onPointerDown={handleZoomOutClick}>
          <MinusIcon className='ak-graph-buttonZoomOutIcon' />
        </button>
      </div>
    </Container>
  );
};
