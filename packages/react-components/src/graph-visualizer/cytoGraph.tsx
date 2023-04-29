import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { LayoutOptions } from 'cytoscape';
import { FitIcon, MinusIcon, PlusIcon, TargetIcon } from './lib/svgs/icons';
import { createGraph, getElementsDefinition } from './graph';
import type { EdgeData, EdgeStyleProps, NodeData, NodeStyleProps } from './types';
import Container from '@awsui/components-react/container';
import { createClassName, ClassName } from './lib/utils/element';

import styles from './styles.module.scss';

const GRAPH_CANVAS_PADDING = 30;
interface ICytoNetworkProps {
  className?: ClassName;
  nodeData: Map<string, NodeData>;
  edgeData?: Map<string, EdgeData> | null;
  graphLayout?: LayoutOptions;
  nodeStyle?: NodeStyleProps;
  nodeHoverStyle?: NodeStyleProps;
  nodeSelectedStyle?: NodeStyleProps;
  edgeStyle?: EdgeStyleProps;
  edgeHoverStyle?: EdgeStyleProps;
  edgeSelectedStyle?: EdgeStyleProps;
}

export const CytoNetwork: React.FC<ICytoNetworkProps> = (props) => {
  const [graph, setGraph] = useState<ReturnType<typeof createGraph>>();
  const cytoRef = useRef<HTMLDivElement>(null);

  const handleCenterClick = useCallback(() => {
    graph?.center();
  }, [graph]);

  const handleFitClick = useCallback(() => {
    graph?.fit(undefined, GRAPH_CANVAS_PADDING);
  }, [graph]);

  const handleZoomInClick = useCallback(() => {
    if (graph) {
      const currentScale = graph.getZoom();
      graph.setZoom(currentScale + 0.1);
    }
  }, [graph]);

  const handleZoomOutClick = useCallback(() => {
    if (graph) {
      const currentScale = graph.getZoom();
      graph.setZoom(currentScale - 0.1);
    }
  }, [graph]);

  useEffect(() => {
    if (graph) {
      graph.resize();
      graph.center();
    }
  }, [graph]);

  useEffect(() => {
    if (cytoRef.current) {
      const graph = createGraph(cytoRef.current, {
        canvasPadding: GRAPH_CANVAS_PADDING,
        fitOnLoad: true,
        layoutOptions: props.graphLayout?.name ? props.graphLayout : undefined,
      });

      setGraph(graph);

      return () => {
        graph.dispose();
      };
    }
    return undefined; //this is coz in tsconfig "noImplicitReturns" is set to  true, usually no return needed.
  }, [props.graphLayout]);
  useEffect(() => {
    if (graph) {
      if (props.edgeData) {
        graph.setGraphData(getElementsDefinition([...props.nodeData.values()], [...props.edgeData.values()]));
      } else {
        graph.setGraphData(getElementsDefinition([...props.nodeData.values()]));
      }
      graph.resize();
      graph.center();
    }
  }, [graph, props.nodeData, props.edgeData]);

  return (
    <Container className={createClassName(styles.root, props.className)}>
      <div className={styles.content} ref={cytoRef} />
      <div className={styles.controls}>
        <button className={styles.button} onPointerDown={handleFitClick}>
          <FitIcon className={styles.buttonFitIcon} />
        </button>
        <button className={styles.button} onPointerDown={handleCenterClick}>
          <TargetIcon className={styles.buttonCenterIcon} />
        </button>
        <button className={styles.button} onPointerDown={handleZoomInClick}>
          <PlusIcon className={styles.buttonZoomInIcon} />
        </button>
        <button className={styles.button} onPointerDown={handleZoomOutClick}>
          <MinusIcon className={styles.buttonZoomOutIcon} />
        </button>
      </div>
    </Container>
  );
};
