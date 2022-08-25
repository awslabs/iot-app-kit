import { Component, h } from '@stencil/core';

@Component({
  tag: 'iot-context-menu-section',
  styleUrl: 'iot-context-menu-section.css',
  shadow: false,
})
export class IotContextMenuSection {
  render() {
    return (
      <div class="iot-context-menu-section">
        <slot />
      </div>
    );
  }
}
