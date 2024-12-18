import type { FC } from 'react';
import { createElement } from 'react';
import { WidgetComponentMap } from '~/customization/widgetComponentMap';
import { useAssistantConfiguration } from '~/hooks/useAssistantConfiguration';
import type { WidgetsMessages } from '~/messages';
import type { DashboardWidget } from '~/types';
import './dynamicWidget.css';

const IconX: FC = () => (
  <svg
    aria-hidden='true'
    data-prefix='far'
    data-icon='times-circle'
    pointerEvents='none'
    className='svg-inline--fa fa-times-circle fa-w-16'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 512 512'
  >
    <title>warning - widget failed</title>
    <path d='M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm101.8-262.2L295.6 256l62.2 62.2c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 295.6l-62.2 62.2c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l62.2-62.2-62.2-62.2c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l62.2 62.2 62.2-62.2c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17z' />
  </svg>
);

export type DynamicWidgetProps = {
  widget: DashboardWidget;
  widgetsMessages: WidgetsMessages;
};

export const getDragLayerProps = ({
  widget,
  widgetsMessages,
}: {
  widget: DashboardWidget;
  widgetsMessages: WidgetsMessages;
}): DynamicWidgetProps => ({
  widget,
  widgetsMessages,
});

const DynamicWidgetComponent: React.FC<DynamicWidgetProps> = ({
  widget,
  widgetsMessages,
}) => {
  const { invalidTagHeader, invalidTagSubheader } = widgetsMessages;

  const componentTag = widget.type;
  const Component = WidgetComponentMap[componentTag];
  const componentIsRegistered = typeof Component !== 'undefined';
  const { assistantConfiguration } = useAssistantConfiguration(widget.id);

  return componentIsRegistered ? (
    createElement(Component, {
      ...widget,
      properties: {
        ...widget.properties,
        assistant: assistantConfiguration,
      },
    })
  ) : (
    <div className='error-container'>
      <IconX />
      <p className='error-container-text'>{invalidTagHeader}</p>
      <p className='error-container-text'>{invalidTagSubheader}</p>
    </div>
  );
};

export default DynamicWidgetComponent;
