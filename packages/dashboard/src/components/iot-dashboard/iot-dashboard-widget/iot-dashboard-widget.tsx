import { Component, Prop, h, Host } from '@stencil/core';
import { MinimalViewPortConfig } from '@synchro-charts/core';
import { RecursivePartial, Widget } from '../../../types';
import { DashboardMessages } from '../../../messages';

@Component({
  tag: 'iot-dashboard-widget',
  styleUrl: 'iot-dashboard-widget.css',
  shadow: false,
})
export class IotDashboardWidget {
  @Prop() isSelected: boolean;
  @Prop() cellSize: number;
  @Prop() width: number;
  @Prop() widget: Widget;
  @Prop() viewport: MinimalViewPortConfig;
  @Prop() messageOverrides: DashboardMessages;

  render() {
    const { x, y, z, width, height, id, componentTag, queries, properties, annotations } = this.widget;
    const { cellSize } = this;

    const { invalidTagHeader, invalidTagSubheader } = this.messageOverrides.widgets;
    return (
      <Host
        style={{
          position: 'absolute',
          zIndex: z.toString(),
          top: `${cellSize * (y - 1)}px`,
          left: `${cellSize * (x - 1)}px`,
          width: `${cellSize * width}px`,
          height: `${cellSize * height}px`,
        }}
      >
        <div id={id} class={`widget ${this.isSelected && 'widget-selected'}`}>
          <iot-dashboard-dynamic-widget
            {...properties}
            queries={queries}
            annotations={annotations}
            viewport={this.viewport}
            componentTag={componentTag}
            widgetId={id}
            invalidTagErrorHeader={invalidTagHeader}
            invalidTagErrorSubheader={invalidTagSubheader}
          />
        </div>
      </Host>
    );
  }
}
