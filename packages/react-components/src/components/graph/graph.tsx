import React, { FC, HTMLAttributes, useCallback, useEffect, useRef } from 'react';
import type { Core, ElementDefinition, LayoutOptions } from 'cytoscape';
import { FitIcon, MinusIcon, PlusIcon, TargetIcon } from './lib/svgs/icons';
import Container from '@awsui/components-react/container';

import CytoscapeComponent from 'react-cytoscapejs';

import './styles.scss';

export interface CytoGraphProps extends HTMLAttributes<HTMLDivElement> {
  graphLayout?: LayoutOptions;
}

export const ZOOM_INTERVAL = 1;

export const Graph: FC<CytoGraphProps> = ({ graphLayout, className, ...props }) => {
  const elements = [
    { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
    { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
    { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } },
  ];

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

  // istanbul ignore next
  // Don't care about testing reacts built in ref setting logic.
  const setCy = (c: Core) => {
    cy.current = c;
  };

  return (
    <Container className={`ak-graph ${className || ''}`.trim()} {...props}>
      <CytoscapeComponent
        cy={setCy}
        layout={graphLayout}
        elements={elements as ElementDefinition[]}
        style={{ width: '100vw', height: '100vh' }}
      />
      <div className='ak-graph-controls'>
        <button data-testid='fit-button' className='ak-graph-button' onClick={handleFitClick}>
          <FitIcon className='ak-graph-buttonFitIcon' />
        </button>
        <button data-testid='center-button' className='ak-graph-button' onClick={handleCenterClick}>
          <TargetIcon className='ak-graph-buttonCenterIcon' />
        </button>
        <button data-testid='zoom-in-button' className='ak-graph-button' onClick={handleZoomInClick}>
          <PlusIcon className='ak-graph-buttonZoomInIcon' />
        </button>
        <button data-testid='zoom-out-button' className='ak-graph-button' onClick={handleZoomOutClick}>
          <MinusIcon className='ak-graph-buttonZoomOutIcon' />
        </button>
      </div>
    </Container>
  );
};
