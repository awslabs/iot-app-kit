import { Density, Mode } from '@awsui/global-styles';

import { COMPOSER_FEATURES } from '../../src';
import scenes from '../scenes';

export const viewerArgTypes = {
  workspaceId: {
    table: { category: 'AWS' },
    control: 'text',
  },
  // if local scene
  scene: {
    options: Object.keys(scenes),
    control: 'select',
    table: { category: 'Scene' },
    if: { arg: 'sceneSource', eq: 'local' },
  },
  sceneId: {
    if: { arg: 'sceneSource', eq: 'aws' },
    table: { category: 'Scene' },
    control: 'text',
  },
  queriesJSON: {
    table: { category: 'Data' },
    control: 'text',
  },
  viewportDurationSecs: {
    table: { category: 'Data' },
    control: 'text', //
  },
  viewportStart: {
    table: { category: 'Data' },
    control: 'text', //
  },
  theme: {
    options: Object.values(Mode),
    control: 'inline-radio',
    table: { category: 'Theme' },
  },
  density: {
    options: Object.values(Density),
    control: 'inline-radio',
    table: { category: 'Theme' },
  },
  features: {
    options: Object.values(COMPOSER_FEATURES),
    control: 'check',
    table: { category: 'Advanced' },
  },
  onSelectionChanged: {
    action: 'selection-changed',
    table: { category: 'Events' },
  },
  onWidgetClick: {
    action: 'widget-clicked',
    table: { category: 'Events' },
  },
};
