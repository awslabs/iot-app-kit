/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import cytoscape, { EventObjectCore, EventObjectEdge } from 'cytoscape';
import type {
  Css,
  EdgeDefinition,
  ElementsDefinition,
  LayoutOptions,
  EventObjectNode,
  NodeCollection,
  NodeDefinition,
  NodeSingular,
} from 'cytoscape';
// `cytoscape-cise` does not have TypeScript definitions.
//@ts-ignore
import cise from 'cytoscape-cise';
import type { ValueOf } from 'type-fest';
import {
  EDGE_DEFAULT_STYLE_PROPS,
  EDGE_HOVER_STYLE_PROPS,
  EDGE_SELECTED_STYLE_PROPS,
  NODE_DEFAULT_STYLE_PROPS,
  NODE_HOVER_STYLE_PROPS,
  NODE_SELECTED_STYLE_PROPS,
} from './defaultProps';
import { isNil, isString } from './lib/utils/lang';
import { getPolygonPoints, getSvgSize } from './svg';
import type {
  EdgeArrowStyleProps,
  EdgeData,
  EdgeEndpoint,
  EdgeStyleProps,
  EventDetail,
  NodeData,
  NodeStyleProps,
  Subscriber,
} from './types';
//import { verify } from "crypto";

interface NodesDefinition {
  nodes: NodeDefinition[];
}

cytoscape.use(cise);

export function createGraph(
  container: HTMLElement,
  {
    canvasPadding,
    elements,
    fitOnLoad = false,
    maxZoom = 2,
    minZoom = 0.1,
    rootElementIds = [],
    layoutOptions,
    nodeStyle,
    nodeHoverStyle,
    nodeSelectedStyle,
    edgeStyle,
    edgeHoverStyle,
    edgeSelectedStyle,
  }: Partial<{
    canvasPadding: number;
    elements: ElementsDefinition;
    fitOnLoad: boolean;
    maxZoom: number;
    minZoom: number;
    rootElementIds: string[];
    layoutOptions?: LayoutOptions;
    nodeStyle?: NodeStyleProps;
    nodeHoverStyle?: NodeStyleProps;
    nodeSelectedStyle?: NodeStyleProps;
    edgeStyle?: EdgeStyleProps;
    edgeHoverStyle?: EdgeStyleProps;
    edgeSelectedStyle?: EdgeStyleProps;
  }> = {}
) {
  const nodeNormalStyles = getNodeStyle(nodeStyle ? nodeStyle : NODE_DEFAULT_STYLE_PROPS);
  const nodeHoverStyles = getNodeStyle(nodeHoverStyle ? nodeHoverStyle : NODE_HOVER_STYLE_PROPS);
  const nodeSelectedStyles = getNodeStyle(nodeSelectedStyle ? nodeSelectedStyle : NODE_SELECTED_STYLE_PROPS);
  const edgeNormalStyles = getEdgeStyle(edgeStyle ? edgeStyle : EDGE_DEFAULT_STYLE_PROPS);
  const edgeHoverStyles = getEdgeStyle(edgeHoverStyle ? edgeHoverStyle : EDGE_HOVER_STYLE_PROPS);
  const edgeSelectedStyles = getEdgeStyle(edgeSelectedStyle ? edgeSelectedStyle : EDGE_SELECTED_STYLE_PROPS);

  const subscribers = new Set<Subscriber>();

  const defaultLayoutOptions = {
    //@ts-ignore
    name: 'cise',
    animate: false,
    fit: fitOnLoad,
    nodeDimensionsIncludeLabels: true,
    padding: canvasPadding,
    randomize: false,
    roots: rootElementIds,
  };

  const cy = cytoscape({
    container,
    elements,
    layout: elements ? (layoutOptions ? layoutOptions : defaultLayoutOptions) : undefined,
    minZoom,
    maxZoom,
    style: [
      { selector: 'node', style: nodeNormalStyles },
      { selector: 'node.hover', style: nodeHoverStyles },
      { selector: 'node:selected', style: nodeSelectedStyles },
      { selector: 'edge', style: edgeNormalStyles },
      { selector: 'edge.hover', style: edgeHoverStyles },
      { selector: 'edge:selected', style: edgeSelectedStyles },
      { selector: 'edge.related-hover', style: edgeHoverStyles },
      { selector: 'edge.related-selected', style: edgeSelectedStyles },
    ],
  });

  cy.on('click', ({ target }: EventObjectNode | EventObjectEdge | EventObjectCore) => {
    emitEvent({ eventName: 'click', data: getTargetData(target) });
  });

  cy.on('mouseover', 'node', ({ target }: EventObjectNode) => {
    if (!target.selected()) target.addClass('hover');
    target.connectedEdges().addClass('related-hover');
    emitEvent({ eventName: 'mouseover', data: getTargetData(target) });
  });

  cy.on('mouseout', 'node', ({ target }: EventObjectNode) => {
    target.removeClass('hover');
    target.connectedEdges().removeClass('related-hover');
    emitEvent({ eventName: 'mouseout', data: getTargetData(target) });
  });

  cy.on('select', 'node', ({ target }: EventObjectNode) => {
    target.connectedEdges().addClass('related-selected');
    emitEvent({ eventName: 'select', data: getTargetData(target) });
  });

  cy.on('unselect', 'node', ({ target }: EventObjectNode) => {
    target.connectedEdges().removeClass('related-selected');
    emitEvent({ eventName: 'unselect', data: getTargetData(target) });
  });

  function getTargetData(
    target: ValueOf<EventObjectNode | EventObjectEdge | EventObjectCore, 'target'>
  ): any | undefined {
    const data = target.data();
    if (Object.keys(data).length) {
      return data;
    }
  }

  // public api

  function center(node?: NodeCollection | NodeSingular | string) {
    if (isNil(node)) {
      cy.center();
    } else {
      if (isString(node)) {
        node = cy.nodes(`#${node}`);
      }

      if (!nodesInView(node)) {
        cy.center(node);
      }
    }
  }

  function clearGraph() {
    cy.elements().remove();
  }

  function deselectNode(id?: string | null) {
    if (id) {
      cy.nodes().getElementById(id).unselect();
    } else {
      cy.nodes().unselect();
    }
  }

  function dispose() {
    unsubscribeAll();
    cy.unmount();
    cy.destroy();
  }

  function fit(...args: Parameters<typeof cy.fit>) {
    cy.fit(...args);
  }

  function getZoom() {
    return cy.zoom();
  }

  /**
   * Based on: https://github.com/cytoscape/cytoscape.js/issues/2283#issuecomment-461897618
   */
  function nodesInView(nodes: NodeCollection | NodeSingular) {
    const bb1 = nodes.boundingBox();
    const bb2 = cy.extent();
    return bb1.x1 > bb2.x1 && bb1.x2 < bb2.x2 && bb1.y1 > bb2.y1 && bb1.y2 < bb2.y2;
  }

  function resize() {
    cy.resize();
  }

  function selectNode(id: string) {
    cy.nodes().unselect();
    const node = cy.nodes(`#${id}`);
    node.select();
    center(node);
  }

  function setGraphData(elementsDefinition: ElementsDefinition | NodesDefinition) {
    clearGraph();

    if (elementsDefinition.nodes.length) {
      cy.add(elementsDefinition as ElementsDefinition);
      cy.layout(layoutOptions ? layoutOptions : defaultLayoutOptions).run();
    }
  }

  function setNodeData(data: NodeData) {
    cy.nodes().data({ ...data, isDirty: true });
  }

  function setZoom(level: number) {
    cy.zoom({ level, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } });
  }

  function subscribe(subscriber: Subscriber) {
    subscribers.add(subscriber);
    return () => unsubscribe(subscriber);
  }

  function unsubscribe(subscriber: Subscriber) {
    subscribers.delete(subscriber);
  }

  function unsubscribeAll() {
    subscribers.clear();
  }

  // private methods

  function emitEvent(ev: EventDetail) {
    subscribers.forEach((subscriber) => {
      subscriber(ev);
    });
  }

  return {
    center,
    clearGraph,
    deselectNode,
    dispose,
    fit,
    getZoom,
    nodesInView,
    resize,
    selectNode,
    setGraphData,
    setNodeData,
    setZoom,
    subscribe,
    unsubscribe,
    unsubscribeAll,
  };
}

export function getElementsDefinition(
  nodeData: NodeData[],
  edgeData?: EdgeData[]
): ElementsDefinition | NodesDefinition {
  if (edgeData)
    return {
      edges: edgeData.map<EdgeDefinition>((data) => ({
        data: { lineStyle: 'solid', dashPattern: [6, 5], ...data },
      })),
      nodes: nodeData.map<NodeDefinition>((data) => ({
        data: { ...data, isDirty: true, size: getSvgSize(data.shape) },
      })),
    };
  else
    return {
      nodes: nodeData.map<NodeDefinition>((data) => ({
        data: { ...data, isDirty: true, size: getSvgSize(data.shape) },
      })),
    };
}

function getEdgeStyle({
  color,
  curveStyle,
  dashOffset,
  endCap,
  midSourceArrow,
  midTargetArrow,
  opacity,
  sourceArrow,
  sourceEndpoint,
  targetArrow,
  targetEndpoint,
  width,
}: EdgeStyleProps): cytoscape.Css.Edge {
  const arrowStyles = Object.entries({
    midSourceArrow,
    midTargetArrow,
    sourceArrow,
    targetArrow,
  }).reduce<cytoscape.Css.Edge>((accum, [key, props]) => {
    const arrowKey: Parameters<typeof getEdgeArrowStyle>[0] =
      key === 'midSourceArrow'
        ? 'mid-source'
        : key === 'midTargetArrow'
        ? 'mid-target'
        : key === 'sourceArrow'
        ? 'source'
        : 'target';

    if (props) accum = { ...accum, ...getEdgeArrowStyle(arrowKey, props) };
    return accum;
  }, {});

  return {
    ...arrowStyles,
    'line-color': color,
    'curve-style': curveStyle ?? 'straight',
    'line-dash-offset': dashOffset,
    //@ts-ignore
    'line-dash-pattern': 'data(dashPattern)',
    //@ts-ignore
    'line-style': 'data(lineStyle)',
    'line-cap': endCap ?? 'butt',
    'line-opacity': opacity ?? 1,
    'overlay-opacity': 0,
    'source-endpoint': sourceEndpoint ?? getEdgeEndpointStyle('inside-to-node'),
    'target-endpoint': targetEndpoint ?? getEdgeEndpointStyle('outside-to-node'),
    width: width,
  };
}

function getEdgeArrowStyle(
  key: 'mid-source' | 'mid-target' | 'source' | 'target',
  { color, fill, shape, scale }: EdgeArrowStyleProps
): cytoscape.Css.Edge {
  return {
    'arrow-scale': scale ?? 1,
    [`${key}-arrow-color`]: color,
    [`${key}-arrow-fill`]: fill ?? 'filled',
    [`${key}-arrow-shape`]: shape,
  };
}

function getEdgeEndpointStyle(endpoint: EdgeEndpoint) {
  return endpoint;
}

function getNodeStyle({
  backgroundImage,
  backgroundOpacity,
  labelBackgroundColor,
  labelTextColor,
  labelTextSize,
  labelOffset,
  labelPadding,
  labelPosition,
  shape,
  transitionDuration,
  transitionEasing,
  zIndex,
}: NodeStyleProps): Css.Node {
  const labelProps: Css.Node = {
    color: labelTextColor ?? 'steelblue',
    'font-size': labelTextSize,
    'font-weight': 'normal',
    label: 'data(name)',
    'line-height': 1,
    'text-background-color': labelBackgroundColor,
    'text-background-opacity': isNil(labelBackgroundColor) ? 0 : 1,
    'text-background-padding': `${labelPadding}px`,
    'text-background-shape': 'roundrectangle',
    'text-border-width': 1,
    'text-halign': labelPosition === 'bottom' || labelPosition === 'top' ? 'center' : labelPosition,
    'text-margin-x': labelPosition === 'left' ? -1 * labelOffset : labelPosition === 'right' ? labelOffset : 0,
    'text-margin-y': labelPosition === 'top' ? -1 * labelOffset : labelPosition === 'bottom' ? labelOffset : 0,
    'text-valign': labelPosition === 'left' || labelPosition === 'right' ? 'center' : labelPosition,
  };

  return {
    'background-fit': 'contain',
    'background-image': backgroundImage,
    'background-opacity': backgroundOpacity ?? 0,
    height: 'data(size)',
    'overlay-opacity': 0,
    //@ts-ignore
    shape: shape ?? 'ellipse',
    //@ts-ignore
    'shape-polygon-points': getPolygonPoints,
    'transition-duration': transitionDuration ?? 100,
    'transition-timing-function': transitionEasing ?? 'linear',
    width: 'data(size)',
    'z-index': zIndex ?? 0,
    ...labelProps,
  };
}
