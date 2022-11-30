import { Density, Mode } from '@awsui/global-styles';

import { COMPOSER_FEATURES } from '../../src';
import { testScenes } from '../../tests/testData';

export const viewerArgs = {
  source: {
    options: ['local', 'aws'],
    control: 'inline-radio',
    table: { category: 'Scene' },
  },
  // if local scene
  scene: {
    options: Object.keys(testScenes),
    control: 'select',
    table: { category: 'Scene' },
    if: { arg: 'source', eq: 'local' },
  },
  // if aws scene
  awsAccessKeyId: {
    if: { arg: 'source', eq: 'aws' },
    table: { category: 'Scene' },
    control: 'text',
  },
  awsSecretAccessKey: {
    if: { arg: 'source', eq: 'aws' },
    table: { category: 'Scene' },
    control: 'text',
  },
  awsSessionToken: {
    if: { arg: 'source', eq: 'aws' },
    table: { category: 'Scene' },
    control: 'text',
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
