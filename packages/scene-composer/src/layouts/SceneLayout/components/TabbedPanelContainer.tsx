import React from 'react';
import { Tabs } from '@cloudscape-design/components';

import { TABBED_PANEL_CONTAINER_NAME } from '../../../common/internalConstants';

type TabbedPanelContainerProps = {
  panels: Record<string, JSX.Element>;
};

const TabbedPanelContainer = (props: TabbedPanelContainerProps) => {
  const { panels } = props;

  const tabs = Object.keys(panels).map((tabName) => {
    return {
      label: tabName,
      id: tabName,
      content: panels[tabName],
    };
  });

  return <Tabs className={TABBED_PANEL_CONTAINER_NAME} tabs={tabs} />;
};

export default TabbedPanelContainer;
