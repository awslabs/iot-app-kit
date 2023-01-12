import React from 'react';

import './dynamicWidget.css';
import { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import { AppKitComponentTag, AppKitComponentTags, AppKitWidget, DashboardConfiguration, Widget } from '../../types';
import { ComponentMap } from './componentMap';
import { WidgetsMessages } from '../../messages';

// eslint-disable-next-line
const IconX = require('./iconx.svg') as string;

export type DynamicWidgetProps = {
  readonly: boolean;
  query?: SiteWiseQuery;
  viewport: DashboardConfiguration['viewport'];
  widget: Widget;
  isSelected: boolean;
  widgetsMessages: WidgetsMessages;
};

export const getDragLayerProps = ({
  widget,
  viewport,
  widgetsMessages,
}: {
  widget: Widget;
  viewport: DashboardConfiguration['viewport'];
  widgetsMessages: WidgetsMessages;
}): DynamicWidgetProps => ({
  widget,
  viewport,
  widgetsMessages,
  isSelected: false,
  readonly: true,
});

const DynamicWidgetComponent: React.FC<DynamicWidgetProps> = ({
  readonly,
  query,
  widget,
  viewport,
  isSelected,
  widgetsMessages,
}) => {
  const { invalidTagHeader, invalidTagSubheader, text } = widgetsMessages;

  const componentTag = widget.componentTag;
  const Component = ComponentMap[componentTag];
  const componentIsRegistered = typeof Component !== 'undefined';

  let componentSpecificProps = {};
  if (AppKitComponentTags.includes(componentTag as AppKitComponentTag)) {
    componentSpecificProps = {
      viewport,
      widgetId: widget.id,
      queries: query !== undefined ? [query?.timeSeriesData({ assets: (widget as AppKitWidget).assets || [] })] : [],
    };
  } else if (componentTag === 'text') {
    componentSpecificProps = {
      messageOverrides: text,
    };
  }

  const props = {
    ...componentSpecificProps,
    ...widget,
    readonly,
    isSelected,
  };

  return componentIsRegistered ? (
    React.createElement(Component, props)
  ) : (
    <div className="error-container">
      <img className="error-icon" src={IconX} alt="warning - widget failed" />
      <p className="error-container-text">{invalidTagHeader}</p>
      <p className="error-container-text">{invalidTagSubheader}</p>
    </div>
  );
};

export default DynamicWidgetComponent;
