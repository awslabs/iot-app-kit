import {
  type RegisteredWidgetType,
  Registry,
} from '~/features/widget-plugins/registry';
import { type WidgetInstance } from '~/features/widget-instance/instance';
import './dynamicWidget.css';

export interface DynamicWidgetProps<Type extends RegisteredWidgetType> {
  widget: WidgetInstance<Type>;
}

export const getDragLayerProps = <Type extends RegisteredWidgetType>({
  widget,
}: DynamicWidgetProps<Type>) => ({
  widget,
});

export const DynamicWidgetComponent = <Type extends RegisteredWidgetType>({
  widget,
}: DynamicWidgetProps<Type>) => {
  const Component = Registry.get(widget.type).configuration.component;
  // FIXME: Broken assistant config
  // const { assistantConfiguration } = useAssistantConfiguration(widget.id);

  return <Component widget={widget} />;
};
