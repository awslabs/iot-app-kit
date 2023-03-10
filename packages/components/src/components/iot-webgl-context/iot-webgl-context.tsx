import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'iot-webgl-context',
  shadow: false,
})
export class IotWebglContext {
  @Prop() viewFrame: HTMLElement | Window | undefined;

  render() {
    return <iot-app-kit-vis-webgl-context viewFrame={this.viewFrame} />;
  }
}
