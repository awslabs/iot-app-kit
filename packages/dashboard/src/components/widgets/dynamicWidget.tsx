import React from 'react';

import './dynamicWidget.css';
import { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import { AppKitComponentTag, AppKitComponentTags, AppKitWidget, DashboardConfiguration, Widget } from '../../types';
import { ComponentMap } from './componentMap';
import { WidgetsMessages } from '../../messages';

const IconX: React.FC = () => (
  <svg
    aria-hidden="true"
    data-prefix="far"
    data-icon="times-circle"
    className="svg-inline--fa fa-times-circle fa-w-16"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <title>warning - widget failed</title>
    <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm101.8-262.2L295.6 256l62.2 62.2c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 295.6l-62.2 62.2c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l62.2-62.2-62.2-62.2c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l62.2 62.2 62.2-62.2c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17z" />
  </svg>
);

export type DynamicWidgetProps = {
  readOnly: boolean;
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
  readOnly: true,
});

const DynamicWidgetComponent: React.FC<DynamicWidgetProps> = ({
  readOnly,
  query,
  widget,
  viewport,
  isSelected,
  widgetsMessages,
}) => {
  const { invalidTagHeader, invalidTagSubheader, text, input } = widgetsMessages;

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
  } else if (componentTag === 'input') {
    componentSpecificProps = {
      messageOverrides: input,
    };
  }

  const props = {
    ...componentSpecificProps,
    ...widget,
    readOnly,
    isSelected,
  };

  return componentIsRegistered ? (
    React.createElement(Component, props)
  ) : (
    <div className="error-container">
      <IconX />
      <p className="error-container-text">{invalidTagHeader}</p>
      <p className="error-container-text">{invalidTagSubheader}</p>
    </div>
  );
};

export default DynamicWidgetComponent;
