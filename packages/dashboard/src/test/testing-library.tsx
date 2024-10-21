import {
  render as rtlRender,
  renderHook as rtlRenderHook,
  type RenderHookOptions,
  type RenderOptions,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import merge from 'lodash/merge';
import React, { type PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import {
  DashboardContext,
  dashboardContextInitialState,
  DashboardContextState,
} from '~/services/dashboard-context';
import {
  createStore,
  type Dispatch,
  type PreloadedRootState,
  type Store,
} from '~/store';

type Render = typeof rtlRender;
type RenderResult = ReturnType<Render>;
type RenderParameters = Parameters<Render>;
type RenderUI = RenderParameters[0];

interface ExtendedRenderOptions extends RenderOptions {
  preloadedState?: PreloadedRootState | PreloadedRootState[];
  store?: Store;
  dashboardContextState?: Partial<DashboardContextState>;
}

function render(
  ui: RenderUI,
  extendedRenderOptions: ExtendedRenderOptions = {}
): RenderResult & { dispatch: Dispatch; dispatchSpy: Dispatch; store: Store } {
  const rootState = Array.isArray(extendedRenderOptions.preloadedState)
    ? extendedRenderOptions.preloadedState.reduce(
        (acc, current) => merge(acc, current),
        {}
      )
    : extendedRenderOptions.preloadedState ?? {};

  const {
    // automatically create a store instance if no store was passed in
    store = createStore(rootState),
    ...renderOptions
  } = extendedRenderOptions;
  // provide to enable assertions on dispatching redux actions
  const dispatchSpy = jest.fn();
  // we still want the actual dispatch to occur to induce state changes
  const realDispatch = store.dispatch;
  // we call them both
  const composedDispatch: Dispatch = ((action: Parameters<Dispatch>[0]) => {
    dispatchSpy(action);
    realDispatch(action);
  }) as Dispatch;
  // replace store method
  store.dispatch = composedDispatch;

  const dashboardContextState: DashboardContextState = {
    ...dashboardContextInitialState,
    ...extendedRenderOptions.dashboardContextState,
  };

  const Wrapper = ({ children }: PropsWithChildren) => (
    <DashboardContext.Provider value={dashboardContextState}>
      <Provider store={store}>{children}</Provider>
    </DashboardContext.Provider>
  );

  return {
    ...rtlRender(ui, { ...renderOptions, wrapper: Wrapper }),
    dispatch: realDispatch,
    dispatchSpy,
    store,
  };
}

type RenderHook<Result, Props> = typeof rtlRenderHook<Result, Props>;
type RenderHookParameters<Result, Props> = Parameters<
  RenderHook<Result, Props>
>;
type RenderHookRender<Result, Props> = RenderHookParameters<Result, Props>[0];

interface ExtendedRenderHookOptions<Props> extends RenderHookOptions<Props> {
  preloadedState?: PreloadedRootState | PreloadedRootState[];
  store?: Store;
}

/** Custom implementation of testing-library's renderHook utility. */
function renderHook<Result, Props>(
  render: RenderHookRender<Result, Props>,
  extendedRenderHookOptions: ExtendedRenderHookOptions<Props> = {}
) {
  const rootState = Array.isArray(extendedRenderHookOptions.preloadedState)
    ? extendedRenderHookOptions.preloadedState.reduce(
        (acc, current) => merge(acc, current),
        {}
      )
    : extendedRenderHookOptions.preloadedState ?? {};

  const {
    // Automatically create a store instance if no store was passed in
    store = createStore(rootState),
    ...renderHookOptions
  } = extendedRenderHookOptions;
  // provide to enable assertions on dispatching redux actions
  const dispatchSpy = jest.fn();
  // we still want the actual dispatch to occur to induce state changes
  const realDispatch = store.dispatch;
  // we call them both
  const composedDispatch: Dispatch = ((action: Parameters<Dispatch>[0]) => {
    dispatchSpy(action);
    realDispatch(action);
  }) as Dispatch;
  // replace store method
  store.dispatch = composedDispatch;

  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );

  return {
    ...rtlRenderHook(render, {
      ...renderHookOptions,
      wrapper: ({ children }) => {
        return <Wrapper>{children}</Wrapper>;
      },
    }),
    dispatch: realDispatch,
    dispatchSpy,
    store,
  };
}

const user = userEvent.setup();

// re-export everything
// eslint-disable-next-line import/export
export * from '@testing-library/react';

export {
  // override render method
  // eslint-disable-next-line import/export
  render,
  // override renderHook method
  // eslint-disable-next-line import/export
  renderHook,
  user,
  userEvent,
};
