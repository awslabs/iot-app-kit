import { Component, h } from '@stencil/core';

const SIZE = {
  width: 400,
  height: 400,
};

const urlParams = new URLSearchParams(window.location.search);
const widthParam = urlParams.get('width');
const heightParam = urlParams.get('height');
const numComponentsParam = urlParams.get('numComponents');
const delayBeforeRenderParam = urlParams.get('delayBeforeRender');

const NUM_COMPONENTS = numComponentsParam ? Number.parseInt(numComponentsParam, 10) : 1;
const WIDTH = widthParam ? Number.parseInt(widthParam, 10) : SIZE.width;
const HEIGHT = heightParam ? Number.parseInt(heightParam, 10) : SIZE.height;
const DELAY_BEFORE_RENDER = delayBeforeRenderParam ? Number.parseInt(delayBeforeRenderParam, 10) : 0;

@Component({
  tag: 'monitor-lazily-load-standard',
})
export class MonitorLazilyLoadStandard {
  render() {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', width: `${WIDTH}px`, height: `${HEIGHT}px` }}>
        {new Array(NUM_COMPONENTS).fill(0).map((_, i) => (
          <div key={i.toString()} style={{ width: `${SIZE.width}px`, height: `${SIZE.height}px` }}>
            <monitor-lazily-load
              delayBeforeRender={DELAY_BEFORE_RENDER}
              renderFunc={() => <monitor-test-box size={SIZE} />}
            />
          </div>
        ))}
      </div>
    );
  }
}
