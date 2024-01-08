import { Component, h } from '@stencil/core';
import '@stencil/router';

import { routes } from './routes';

@Component({
  tag: 'iot-test-routes',
})
export class IotTestRoutes {
  render() {
    return (
      <stencil-router>
        <stencil-route-switch scrollTopOffset={0}>
          {routes.map((r) => (
            <stencil-route
              key={r.url}
              url={r.url}
              component={r.component}
              exact
            />
          ))}
        </stencil-route-switch>
      </stencil-router>
    );
  }
}
