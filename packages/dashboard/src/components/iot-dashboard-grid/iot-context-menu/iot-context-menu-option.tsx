import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'iot-context-menu-option',
  styleUrl: 'iot-context-menu-option.css',
  shadow: false,
})
export class IotContextMenuOption {
  @Prop() disabled: boolean;
  @Prop() onClick?: (event: MouseEvent) => void;

  handleClick(event: MouseEvent) {
    if (this.disabled || !this.onClick) return;
    this.onClick(event);
  }

  render() {
    return (
      <div
        onClick={this.handleClick.bind(this)}
        class={`iot-context-menu-option ${this.disabled && 'iot-context-menu-option-disabled'}`}
      >
        <slot />
        <slot name="hotkey" />
      </div>
    );
  }
}
