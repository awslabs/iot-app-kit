/* istanbul ignore file */
import React from 'react';

import { getGlobalSettings } from '../../../GlobalSettings';
import { COMPOSER_FEATURES } from '../../../interfaces';

import PanelC from './SceneHierarchyPanel.C';
import PanelT1 from './SceneHierarchyPanel';

const Panel = (props) => {
  const enabledSceneHierarchyRedesign = getGlobalSettings().featureConfig[COMPOSER_FEATURES.SceneHierarchyRedesign];

  if (enabledSceneHierarchyRedesign) {
    return <PanelT1 {...props} />;
  }

  return <PanelC {...props} />;
};

export const SceneHierarchyPanel = Panel;
