import { Component, Prop, h, Host, Watch, State } from '@stencil/core';
import { MinimalViewPortConfig } from '@synchro-charts/core';
import { Widget } from '../../../types';

@Component({
  tag: 'iot-dashboard-widget',
  styleUrl: 'iot-dashboard-widget.css',
  shadow: false,
})
export class IotDashboardWidget {
  @Prop() isSelected: boolean;
  @Prop() isMoving: boolean;
  @Prop() cellSize: number;
  @Prop() width: number;
  @Prop() widget: Widget;
  @Prop() viewport: MinimalViewPortConfig;

  render() {
    const { x, y, z, width, height, id, componentTag, queries, properties, annotations } = this.widget;
    const { cellSize } = this;

    // I18n?
    const invalidTagErrorHeader = 'Widget failed to load';
    const invalidTagErrorSubheader = 'Please try again later or contact an admin for help.';

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
            invalidTagErrorHeader={invalidTagErrorHeader}
            invalidTagErrorSubheader={invalidTagErrorSubheader}
          />
        </div>
      </Host>
    );
  }
}
