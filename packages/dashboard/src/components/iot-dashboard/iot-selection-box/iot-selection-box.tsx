import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'iot-selection-box',
  styleUrl: 'iot-selection-box.css',
  shadow: false,
})
export class IotSelectionBox {
  @Prop() x: number;
  @Prop() y: number;
  @Prop() width: number;
  @Prop() height: number;
  render() {
    const { x, y, width, height } = this;
    return (
      <Host
        style={{
          gridColumnStart: `${Math.round(x)}`,
          gridColumnEnd: `${Math.round(x + width)}`,
          gridRowStart: `${Math.round(y)}`,
          gridRowEnd: `${Math.round(y + height)}`,
        }}
      >
        <div class="selection-box">
          <div class="selection-box-side selection-box-side-top" />
          <div class="selection-box-side selection-box-side-bottom" />
          <div class="selection-box-side selection-box-side-left" />
          <div class="selection-box-side selection-box-side-right" />

          <div class="selection-box-corner selection-box-corner-top-right" />
          <div class="selection-box-corner selection-box-corner-top-left" />
          <div class="selection-box-corner selection-box-corner-bottom-right" />
          <div class="selection-box-corner selection-box-corner-bottom-left" />
        </div>
      </Host>
    );
  }
}
