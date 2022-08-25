import { Component, Prop, h } from '@stencil/core';
import { OnResize } from '../../../types';

@Component({
  tag: 'iot-selection-box',
  styleUrl: 'iot-selection-box.css',
  shadow: false,
})
export class IotSelectionBox {
  @Prop() onResize: OnResize;

  @Prop() cellSize: number;
  @Prop() x: number;
  @Prop() y: number;
  @Prop() width: number;
  @Prop() height: number;
  render() {
    const { x, y, width, height, cellSize } = this;
    return (
      <div
        class="selection-box"
        style={{
          top: `${cellSize * (y - 1)}px`,
          left: `${cellSize * (x - 1)}px`,
          width: `${cellSize * width}px`,
          height: `${cellSize * height}px`,
        }}
      >
        <iot-selection-box-anchor onResize={this.onResize} anchor="top" />
        <iot-selection-box-anchor onResize={this.onResize} anchor="bottom" />
        <iot-selection-box-anchor onResize={this.onResize} anchor="right" />
        <iot-selection-box-anchor onResize={this.onResize} anchor="left" />
        <iot-selection-box-anchor onResize={this.onResize} anchor="top-right" />
        <iot-selection-box-anchor onResize={this.onResize} anchor="top-left" />
        <iot-selection-box-anchor onResize={this.onResize} anchor="bottom-right" />
        <iot-selection-box-anchor onResize={this.onResize} anchor="bottom-left" />
      </div>
    );
  }
}
