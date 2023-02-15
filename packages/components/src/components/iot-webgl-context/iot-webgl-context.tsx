import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'iot-webgl-context',
  shadow: false,
})
export class IotWebglContext {
  @Prop() viewFrame: HTMLElement | Window | undefined;

  render() {
    return <sc-webgl-context viewFrame={this.viewFrame} />;
  }
}
