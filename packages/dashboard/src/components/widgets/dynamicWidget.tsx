import {
  type RegisteredWidgetType,
  Registry,
} from '~/features/widget-plugins/registry';
import type { WidgetInstance } from '~/features/widget-instance/instance';
import './dynamicWidget.css';
import { memo } from 'react';

export interface DynamicWidgetProps<WidgetType extends RegisteredWidgetType> {
  widget: WidgetInstance<WidgetType>;
}

const Component = <WidgetType extends RegisteredWidgetType>({
  widget,
}: DynamicWidgetProps<WidgetType>) => {
  const WidgetComponentInstance = Registry.get(widget.type).configuration
    .component;
  // FIXME: Broken assistant config
  // const { assistantConfiguration } = useAssistantConfiguration(widget.id);

  return <WidgetComponentInstance widget={widget} />;
};

export const DynamicWidgetComponent = memo(Component);
