import type cytoscape from 'cytoscape';
import { type Core } from 'cytoscape';
import {
  type CSSProperties,
  forwardRef,
  type MutableRefObject,
  useRef,
} from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { ErrorBoundary } from 'react-error-boundary';

// This is copied straight from the library, because it's not exported, there's no way to access it, but we are wrapping it.
interface CytoscapeComponentProps {
  id?: string | undefined;
  cy?: ((cy: cytoscape.Core) => void) | undefined;
  style?: CSSProperties | undefined;
  elements: cytoscape.ElementDefinition[];
  layout?: cytoscape.LayoutOptions | undefined;
  stylesheet?:
    | cytoscape.Stylesheet
    | cytoscape.Stylesheet[]
    | string
    | undefined;
  className?: string | undefined;
  zoom?: number | undefined;
  pan?: cytoscape.Position | undefined;
  minZoom?: number | undefined;
  maxZoom?: number | undefined;
  zoomingEnabled?: boolean | undefined;
  userZoomingEnabled?: boolean | undefined;
  boxSelectionEnabled?: boolean | undefined;
  autoungrabify?: boolean | undefined;
  autounselectify?: boolean | undefined;
  panningEnabled?: boolean | undefined;
  userPanningEnabled?: boolean | undefined;
  autolock?: boolean | undefined;
  get?: ((obj: Record<string, any>, key: string) => any) | undefined;
  toJson?: ((obj: Record<string, any>) => any) | undefined;
  diff?:
    | ((objA: Record<string, any>, objB: Record<string, any>) => boolean)
    | undefined;
  forEach?:
    | (<T>(
        list: T[],
        iterator: (value: T, index: number, array: T[]) => void
      ) => void)
    | undefined;
  headless?: boolean | undefined;
  styleEnabled?: boolean | undefined;
  hideEdgesOnViewport?: boolean | undefined;
  textureOnViewport?: boolean | undefined;
  motionBlur?: boolean | undefined;
  motionBlurOpacity?: number | undefined;
  wheelSensitivity?: number | undefined;
  pixelRatio?: number | string | undefined;
}

const GraphView = forwardRef<Core, CytoscapeComponentProps>(
  ({ ...props }, ref) => {
    const cy = useRef<Core>();
    // This fixes the type issue with the Cytoscape react library that doesn't actually except "refs". So we handle that here,
    // and make it follow react conventions instead of doing it's own thing.
    // istanbul ignore next (this is tested through other tests, but not the negative case)
    const setRef = (core: Core) => {
      (ref as MutableRefObject<Core | null>).current = core;
      cy.current = core;
    };
    return (
      <ErrorBoundary fallback={<div>Error</div>} onError={() => {}}>
        <CytoscapeComponent cy={setRef} {...props} />;
      </ErrorBoundary>
    );
  }
);

export default GraphView;
