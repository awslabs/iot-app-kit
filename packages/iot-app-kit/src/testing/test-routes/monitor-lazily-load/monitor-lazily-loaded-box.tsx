import { h, Component, Prop } from '@stencil/core';

@Component({
  tag: 'monitor-lazily-loaded-box',
  shadow: false,
})
export class MonitorLazilyLoadedBox {
  @Prop() config: {
    size: {
      width: number;
      height: number;
    };
  } = { size: { width: 0, height: 0 } };

  render() {
    return <monitor-lazily-load renderFunc={() => <monitor-test-box size={this.config.size} />} />;
  }
}
