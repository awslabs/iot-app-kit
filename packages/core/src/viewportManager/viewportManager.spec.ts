import { viewportManager } from './viewportManager';

beforeEach(() => {
  viewportManager.reset();
});

const VIEWPORT = { duration: '2m' };

it('subscribes to a new viewport group and returned an undefined viewport', () => {
  const { viewport } = viewportManager.subscribe('some-group', () => {});
  expect(viewport).toBeUndefined();
});

it('broadcast updates to viewport group', () => {
  const listener = jest.fn();
  viewportManager.subscribe('some-group', listener);
  viewportManager.update('some-group', VIEWPORT);
  expect(listener).toHaveBeenLastCalledWith(VIEWPORT);
});

it('returns current viewport for group is returned upon initial subscription', () => {
  const listener = jest.fn();
  viewportManager.update('some-group', VIEWPORT);
  const { viewport } = viewportManager.subscribe('some-group', listener);

  expect(viewport).toBe(VIEWPORT);
});

it('returns no viewport is returned on initial subscription when reset is called', () => {
  const listener = jest.fn();
  viewportManager.update('some-group', VIEWPORT);
  viewportManager.reset();
  const { viewport } = viewportManager.subscribe('some-group', listener);

  expect(viewport).toBeUndefined();
});

it('does not broadcast viewport updates to different viewport groups ', () => {
  const listener = jest.fn();
  viewportManager.subscribe('some-group', listener);
  viewportManager.update('some-other-group', VIEWPORT);
  expect(listener).not.toHaveBeenCalled();
});

it('broadcasts viewports to multiple listeners', () => {
  const listener = jest.fn();
  const listener2 = jest.fn();
  viewportManager.subscribe('some-group', listener);
  viewportManager.subscribe('some-group', listener2);
  viewportManager.update('some-group', VIEWPORT);

  expect(listener).toHaveBeenLastCalledWith(VIEWPORT);
  expect(listener2).toHaveBeenLastCalledWith(VIEWPORT);
});

it('does not broadcast updates to a unsubscribed listener', () => {
  const listener = jest.fn();
  const { unsubscribe } = viewportManager.subscribe('some-group', listener);

  unsubscribe();
  viewportManager.update('some-group', VIEWPORT);
  expect(listener).not.toHaveBeenCalled();
});

it('does not broadcast updates to a listener after reset is called', () => {
  const listener = jest.fn();
  viewportManager.subscribe('some-group', listener);

  viewportManager.reset();
  viewportManager.update('some-group', VIEWPORT);

  expect(listener).not.toHaveBeenCalled();
});
