import { Component, Prop, h, Listen } from '@stencil/core';
import { Anchor, OnResize } from '../../../types';

const CORNERS: Anchor[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
const SIDES: Anchor[] = ['top', 'right', 'bottom', 'left'];

@Component({
  tag: 'iot-selection-box-anchor',
  styleUrl: 'iot-selection-box-anchor.css',
  shadow: false,
})
export class IotSelectionBoxAnchor {
  @Prop() onResize: OnResize;
  @Prop() anchor: Anchor;

  @Listen('mousedown')
  onMouseDown(event: MouseEvent) {
    this.startResize(event);
  }

  startResize = (event: MouseEvent) => {
    event.stopPropagation();
    this.onResize({ anchor: this.anchor, currentPosition: { x: event.clientX, y: event.clientY } });
  };

  // Whether the anchor is a side anchor
  isSide() {
    return SIDES.includes(this.anchor);
  }

  // Whether the anchor is a corner anchor
  isCorner() {
    return CORNERS.includes(this.anchor);
  }

  render() {
    const isSide = this.isSide();
    const isCorner = this.isCorner();
    return (
      <div
        class={{
          'selection-box-corner': isCorner,
          'selection-box-side': isSide,
          [`selection-box-corner-${this.anchor}`]: isCorner,
          [`selection-box-side-${this.anchor}`]: isSide,
        }}
      />
    );
  }
}
