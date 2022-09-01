import { Component, Prop, h, Host } from '@stencil/core';
import { createPopper, Instance } from '@popperjs/core';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow.js';
import flip from '@popperjs/core/lib/modifiers/flip.js';

@Component({
  tag: 'iot-context-menu',
  styleUrl: 'iot-context-menu.css',
  shadow: false,
})
export class IotContextMenu {
  @Prop() x: number;
  @Prop() y: number;

  placement!: HTMLElement;
  menu!: HTMLElement;

  popper: Instance;

  componentDidRender() {
    this.popper = createPopper(this.placement, this.menu, {
      placement: 'right-start',
      modifiers: [
        flip,
        preventOverflow,
        {
          name: 'offset',
          options: {
            offset: [0, 10],
          },
        },
      ],
    });
  }

  disconnectedCallback() {
    this.popper.destroy();
  }

  render() {
    return (
      <Host>
        <div
          ref={(el) => (this.placement = el as HTMLElement)}
          class="iot-context-menu-placement"
          style={{
            left: `${this.x}px`,
            top: `${this.y}px`,
          }}
        ></div>
        <div ref={(el) => (this.menu = el as HTMLElement)} class="iot-context-menu">
          <slot />
        </div>
      </Host>
    );
  }
}
