import React from 'react';
import { Tabs } from '@awsui/components-react';

type TabbedPanelContainerProps = {
  panels: Record<string, JSX.Element>;
};

type TabbedPanelContainerState = {};

class TabbedPanelContainer extends React.Component<TabbedPanelContainerProps, TabbedPanelContainerState> {
  public static defaultProps = {
    menuBar: null,
    statusBar: null,
    leftPanel: null,
    rightPanel: null,
  };

  render() {
    const tabs = Object.keys(this.props.panels).map((tabName) => {
      return {
        label: tabName,
        id: tabName,
        content: this.props.panels[tabName],
      };
    });
    return <Tabs className={'sidePanelTabs'} tabs={tabs} />;
  }
}

export default TabbedPanelContainer;
