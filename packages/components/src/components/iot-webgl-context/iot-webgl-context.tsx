import { Component, h } from '@stencil/core';

@Component({
  tag: 'iot-webgl-context',
  shadow: false,
})
export class IotWebglContext {
  render() {
    return <sc-webgl-context />;
  }
}
