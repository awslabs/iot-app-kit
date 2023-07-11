import { Density, Mode } from '@awsui/global-styles';

import { COMPOSER_FEATURES } from '../../src';
import scenes from '../scenes';

export const viewerArgTypes = {
  // if local scene
  scene: {
    options: Object.keys(scenes),
    control: 'select',
    table: { category: 'Scene' },
    if: { arg: 'source', eq: 'local' },
  },
  workspaceId: {
    if: { arg: 'source', eq: 'aws' },
    table: { category: 'Scene' },
    control: 'text',
  },
  sceneId: {
    if: { arg: 'source', eq: 'aws' },
    table: { category: 'Scene' },
    control: 'text',
  },
  queriesJSON: {
    if: { arg: 'source', eq: 'aws' },
    table: { category: 'Scene' },
    control: 'text',
  },
  viewportDurationSecs: {
    if: { arg: 'source', eq: 'aws' },
    table: { category: 'Scene' },
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
