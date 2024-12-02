import {
  render as rtlRender,
  renderHook as rtlRenderHook,
} from '@testing-library/react';
import rtlUserEvent from '@testing-library/user-event';

// TODO: customize for iot-app-kit usage
// TODO: allow packages to further customize/extend

/** Extended implementation of `@testing-library/react`'s `render` testing utility. */
const render = rtlRender;
/** Extended implementation of `@testing-library/react`'s `renderHook` testing utility. */
const renderHook = rtlRenderHook;
const user = rtlUserEvent.setup();

// re-export everything
// eslint-disable-next-line import/export
export * from '@testing-library/react';

export {
  // override
  // eslint-disable-next-line import/export
  render,
  // override
  // eslint-disable-next-line import/export
  renderHook,
  user,
};
