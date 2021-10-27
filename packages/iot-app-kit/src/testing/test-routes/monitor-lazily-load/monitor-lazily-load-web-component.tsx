import { Component, h, Host } from '@stencil/core';

const numComponents = 10;

const SIZE = {
  width: 400,
  height: 400,
};

@Component({
  tag: 'monitor-lazily-load-web-component',
})
export class MonitorLazilyLoadStandard {
  render() {
    return (
      <Host>
        {new Array(numComponents).fill(0).map((_, i) => (
          <div key={i.toString()} style={{ background: 'gray', width: `${SIZE.width}px`, height: `${SIZE.height}px` }}>
            <monitor-lazily-loaded-box config={{ size: SIZE }} />
          </div>
        ))}
      </Host>
    );
  }
}
