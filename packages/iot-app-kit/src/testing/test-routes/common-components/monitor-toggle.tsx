import { Component, h } from '@stencil/core';

@Component({
  tag: 'monitor-toggle-test',
})
export class MonitorToggle {
  render() {
    return [<monitor-toggle checked />, <monitor-toggle checked={false} />];
  }
}
