import { Component, Prop, h, Host } from '@stencil/core';
import { Widget } from '../../../types';

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

  render() {
    const { x, y, width, height, id } = this.widget;
    const { cellSize } = this;
    return (
      <Host
        style={{
          position: 'absolute',
          top: `${cellSize * (y - 1)}px`,
          left: `${cellSize * (x - 1)}px`,
          width: `${cellSize * width}px`,
          height: `${cellSize * height}px`,
        }}
      >
        <div class={`widget ${this.isSelected && 'widget-selected'}`} id={id}>
          <div class="widget-content">{this.widget.widget}</div>
        </div>
      </Host>
    );
  }
}
