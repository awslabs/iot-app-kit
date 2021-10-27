import { Component, h } from '@stencil/core';
import '@stencil/router';

import { routes } from './routes';

@Component({
  tag: 'swc-test-routes',
})
export class SwcTestRoutes {
  render() {
    return (
      <stencil-router>
        <stencil-route-switch scrollTopOffset={0}>
          {routes.map(r => (
            <stencil-route url={r.url} component={r.component} exact />
          ))}
        </stencil-route-switch>
      </stencil-router>
    );
  }
}
