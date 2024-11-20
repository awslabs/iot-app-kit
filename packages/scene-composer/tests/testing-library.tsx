import { render as rtlRender, renderHook as rtlRenderHook } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import type { PropsWithChildren } from 'react';
import { IntlProvider } from 'react-intl';

function Wrapper({ children }: PropsWithChildren) {
  return <IntlProvider locale='en'>{children ?? <></>}</IntlProvider>;
}

type Render = typeof rtlRender;
type RenderParameters = Parameters<Render>;
type RenderUI = RenderParameters[0];
type RenderOptions = RenderParameters[1];
type RenderResult = ReturnType<Render>;

const render = (ui: RenderUI, options?: RenderOptions): RenderResult => {
  return rtlRender(ui, { ...options, wrapper: Wrapper });
};

const renderHook: typeof rtlRenderHook = (ui, options) => {
  return rtlRenderHook(ui, { ...options, wrapper: Wrapper });
};

const user = userEvent.setup();

// eslint-disable-next-line import/export
export * from '@testing-library/react';

export {
  user,
  // override render
  // eslint-disable-next-line import/export
  render,
  // override renderHook
  // eslint-disable-next-line import/export
  renderHook,
};
