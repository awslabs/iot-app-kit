import {
  stateWithCopiedWidgets,
  stateWithSelectedWidgets,
  stateWithWidgets,
} from '#test/stateScenarios';
import { act, renderHook } from '#test/testing-library';
import { useCopyPaste } from './useCopyPaste';

test('user journey', () => {
  const { result } = renderHook(() => useCopyPaste(), {
    // state initialized with selected widgets
    preloadedState: stateWithSelectedWidgets,
  });

  // user can copy the selected widgets
  expect(result.current.canCopy).toBe(true);
  // user cannot paste until widgets are copied
  expect(result.current.canPaste).toBe(false);

  // user copies the selected widgets
  act(() => {
    result.current.copy();
  });

  // user may paste the widgets
  expect(result.current.canPaste).toBe(true);
  // user may copy other widgets
  expect(result.current.canCopy).toBe(true);

  // user decides where to paste their widgets
  const position = { x: 10, y: 20 };
  // user pastes the widgets at the position
  act(() => {
    result.current.paste({ position });
  });

  // user may paste the widgets again
  expect(result.current.canPaste).toBe(true);
  // user may copy other widgets
  expect(result.current.canCopy).toBe(true);
});

test('widgets must be selected to be copied', () => {
  const { result } = renderHook(() => useCopyPaste(), {
    // state initialized without selected widgets
    preloadedState: stateWithWidgets,
  });

  // user has not selected any widgets
  expect(result.current.canCopy).toBe(false);

  // user tries to perform a copy action
  act(() => {
    result.current.copy();
  });

  // no widgets are copied
  expect(result.current.canPaste).toBe(false);
});

test('widgets may be pasted without a position', () => {
  const { result } = renderHook(() => useCopyPaste(), {
    // state initialized with copied widgets
    preloadedState: stateWithCopiedWidgets,
  });

  // paste is called without a position
  act(() => {
    result.current.paste();
  });
});

test('wdigets must be copied to be pasted', () => {
  const { result } = renderHook(() => useCopyPaste(), {
    // state initialized without copied widgets
    preloadedState: stateWithSelectedWidgets,
  });

  // user has not copied any widgets
  expect(result.current.canPaste).toBe(false);

  // user tries to perform a paste action
  act(() => {
    result.current.paste();
  });
});
