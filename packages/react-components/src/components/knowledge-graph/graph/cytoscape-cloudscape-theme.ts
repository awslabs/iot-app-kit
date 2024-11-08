/* eslint-disable react-hooks/exhaustive-deps */
import { type RefObject, useCallback, useEffect, useState } from 'react';
import { STYLE_PREFIX } from './constants';

export const colors = {
  nodeBackground: `--${STYLE_PREFIX}-color-background-node`,
  nodeBackgroundSelected: `--${STYLE_PREFIX}-color-background-node-selected`,
  edgeBackground: ` --${STYLE_PREFIX}-color-background-edge`,
  edgeBackgroundSelected: `--${STYLE_PREFIX}-color-background-edge-selected`,

  /* Foreground Colors */
  node: `--${STYLE_PREFIX}-color-node`,
  nodeSelected: `--${STYLE_PREFIX}-color-node-selected`,
  edge: `--${STYLE_PREFIX}-color-edge`,
  edgeSelected: `--${STYLE_PREFIX}-color-edge-selected`,

  /* Border Colors */
  nodeBorder: `--${STYLE_PREFIX}-color-border-node`,
  nodeBorderSelected: `--${STYLE_PREFIX}-color-border-node-selected`,
  edgeBorder: `--${STYLE_PREFIX}-color-border-edge`,
  edgeBorderSelected: `--${STYLE_PREFIX}-color-border-edge-selected`,

  /* Line Colors */
  edgeLine: `--${STYLE_PREFIX}-color-edge-line`,
  edgeLineSelected: `--${STYLE_PREFIX}-color-edge-line-selected`,
};

const useCloudScapeTheme = (container: RefObject<HTMLDivElement>) => {
  /**
   * For simplicty, we'll return a utility function to lookup a color value
   */
  const colorLookup = useCallback(
    (color: keyof typeof colors, fallback?: string) => {
      if (container.current) {
        const c = getComputedStyle(container.current).getPropertyValue(
          colors[color]
        );
        if (c.trim() !== '') {
          return c;
        }
      }

      console.warn('No color found for', colors[color]);
      // istanbul ignore next (shouldn't really be a factor)
      return fallback;
    },
    [container.current]
  );

  return colorLookup;
};

const useStylesheet = (
  container: RefObject<HTMLDivElement>,
  labelProp = 'label'
) => {
  const color = useCloudScapeTheme(container);
  const [stylesheet, setStylesheet] = useState<cytoscape.Stylesheet[]>([]);

  useEffect(() => {
    if (color) {
      setStylesheet([
        {
          selector: 'node',
          css: {
            shape: (node) => node.data('shape') || 'round-rectangle',
            label: `data(${labelProp})`,
            width: 'label',
            height: 'label',
            'text-background-padding': '1rem',
            'border-width': '0.25rem',
            'padding-left': '2rem',
            'background-color': color('nodeBackground'),
            color: color('node'),
            'text-background-color': color('node'),
            'border-color': color('nodeBorder'),
            'font-size': '5rem',
            'text-valign': 'center',
          },
        },
        {
          selector: 'node:selected',
          css: {
            'background-color': color('nodeBackgroundSelected'),
            color: color('nodeSelected'),
            'border-color': color('nodeBorderSelected'),
          },
        },
        {
          selector: 'edge',
          css: {
            label: `data(${labelProp})`,
            color: color('edge'),
            width: '0.25rem',
            'text-background-color': color('nodeBorder'),
            'font-size': '5rem',
            'text-background-opacity': 1,
            'text-border-style': 'solid',
            'text-border-opacity': 1,
            'text-border-width': '0.25rem',
            'text-border-color': color('edgeBorder'),
            'text-background-padding': '1rem',
            'line-color': color('edgeLine'),
            'target-arrow-shape': 'chevron',
            'arrow-scale': 0.25,
            'target-arrow-color': color('edgeLine'),
            'curve-style': 'bezier',
            'line-style': (node) => node.data('lineStyle') || 'solid',
          },
        },
        {
          selector: 'edge:selected',
          css: {
            'text-background-color': color('edgeBackgroundSelected'),
            color: color('edgeSelected'),
            'text-border-color': color('edgeBorderSelected'),
            'line-color': color('edgeLineSelected'),
            'target-arrow-color': color('edgeLineSelected'),
          },
        },
      ] as cytoscape.Stylesheet[]);
    }
  }, [color, labelProp]);

  return stylesheet;
};

export default useStylesheet;
