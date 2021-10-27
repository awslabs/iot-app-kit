import { Component, h } from '@stencil/core';

@Component({
  tag: 'synchro-demo',
})
export class SynchroDemo {
  render() {
    return (
      <bp-data-store>
        <div style={{ margin: '30px 4%' }}>
          <monitor-demo showAllControls={false} />
          <sc-webgl-context />
        </div>
      </bp-data-store>
    );
  }
}
