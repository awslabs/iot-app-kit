import React, { HTMLAttributes, useCallback, useEffect, useRef } from 'react';
import type { Core, ElementDefinition, EventObject } from 'cytoscape';

import useCyEvent from './hooks/useCyEvent';
import GraphView from './graph-view';
import Toolbar from './graph-toolbar';

import './styles.scss';
import { Button } from '@cloudscape-design/components';
import { STYLE_PREFIX } from './constants';
import useStylesheet from './cytoscape-cloudscape-theme';

export interface GraphProps extends HTMLAttributes<HTMLDivElement> {
  elements: ElementDefinition[];
  onNodeSelected?: (e: EventObject) => void;
  onEdgeSelected?: (e: EventObject) => void;
}

export const ZOOM_INTERVAL = 1;

export function Graph({ className, elements, onNodeSelected, onEdgeSelected, ...props }: GraphProps) {
  const cy = useRef<Core>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const stylesheet = useStylesheet(containerRef);

  const fit = useCallback(() => {
    cy.current?.fit();
  }, []);

  const center = useCallback(() => {
    cy.current?.center();
  }, []);

  const zoomIn = useCallback(() => {
    cy.current?.zoom(cy.current.zoom() + ZOOM_INTERVAL);
  }, []);

  const zoomOut = useCallback(() => {
    cy.current?.zoom(cy.current.zoom() - ZOOM_INTERVAL);
  }, []);

  useEffect(() => {
    cy.current?.resize();
    cy.current?.center();
  }, []);
  console.log('elements: ', elements);

  // TODO: Event modelling needs to be done properly, this is an example
  // istanbul ignore next (No point in testing as this is going to change in next update)
  useCyEvent('tap', 'node', (e) => onNodeSelected && onNodeSelected(e), cy);

  // istanbul ignore next (No point in testing as this is going to change in next update)
  useCyEvent('tap', 'edge', (e) => onEdgeSelected && onEdgeSelected(e), cy);

  return (
    <div ref={containerRef} className={`${STYLE_PREFIX} ${className || ''}`.trim()} {...props}>
      <GraphView ref={cy} stylesheet={stylesheet} elements={elements} style={{ width: '100%', height: '100%' }} />
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
  );
}
