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
    return (
      <Host
        style={{
          gridColumnStart: `${Math.round(x)}`,
          gridColumnEnd: `${Math.round(x + width)}`,
          gridRowStart: `${Math.round(y)}`,
          gridRowEnd: `${Math.round(y + height)}`,
        }}
      >
        <div class={`widget ${this.isSelected && 'widget-selected'}`} id={id}>
          <div class="widget-content">{this.widget.widget}</div>
        </div>
      </Host>
    );
  }
}
