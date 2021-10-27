import { Component, h } from '@stencil/core';

@Component({
  tag: 'testing-ground',
  styleUrl: 'testing-ground.css',
})
export class TestingGround {
  render() {
    return (
      <div style={{ margin: '30px 4%' }}>
        <monitor-demo showAllControls />
        <sc-webgl-context />
      </div>
    );
  }
}
