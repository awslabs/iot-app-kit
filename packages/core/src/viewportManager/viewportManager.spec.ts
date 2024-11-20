import { viewportManager } from './viewportManager';

beforeEach(() => {
  viewportManager.reset();
});

const VIEWPORT = { duration: '2m' };

it('subscribes to a new viewport group and returned an undefined viewport', () => {
  const { viewport } = viewportManager.subscribe('some-group', () => {});
  expect(viewport).toBeNull();
});

it('broadcast updates to viewport group', () => {
  const listener = vi.fn();
  viewportManager.subscribe('some-group', listener);
  viewportManager.update('some-group', VIEWPORT);
  expect(listener).toHaveBeenLastCalledWith(VIEWPORT, undefined);
});

it('returns current viewport for group is returned upon initial subscription', () => {
  const listener = vi.fn();
  viewportManager.update('some-group', VIEWPORT);
  const { viewport } = viewportManager.subscribe('some-group', listener);

  expect(viewport).toBe(VIEWPORT);
});

it('returns no viewport is returned on initial subscription when reset is called', () => {
  const listener = vi.fn();
  viewportManager.update('some-group', VIEWPORT);
  viewportManager.reset();
  const { viewport } = viewportManager.subscribe('some-group', listener);

  expect(viewport).toBeNull();
});

it('does not broadcast viewport updates to different viewport groups ', () => {
  const listener = vi.fn();
  viewportManager.subscribe('some-group', listener);
  viewportManager.update('some-other-group', VIEWPORT);
  expect(listener).not.toHaveBeenCalled();
});

it('broadcasts viewports to multiple listeners', () => {
  const listener = vi.fn();
  const listener2 = vi.fn();
  viewportManager.subscribe('some-group', listener);
  viewportManager.subscribe('some-group', listener2);
  viewportManager.update('some-group', VIEWPORT);

  expect(listener).toHaveBeenLastCalledWith(VIEWPORT, undefined);
  expect(listener2).toHaveBeenLastCalledWith(VIEWPORT, undefined);
});

it('does not broadcast updates to a unsubscribed listener', () => {
  const listener = vi.fn();
  const { unsubscribe } = viewportManager.subscribe('some-group', listener);

  unsubscribe();
  viewportManager.update('some-group', VIEWPORT);
  expect(listener).not.toHaveBeenCalled();
});

it('does not broadcast updates to a listener after reset is called', () => {
  const listener = vi.fn();
  viewportManager.subscribe('some-group', listener);

  viewportManager.reset();
  viewportManager.update('some-group', VIEWPORT);

  expect(listener).not.toHaveBeenCalled();
});

it('can broadcast with a topic', () => {
  const listener = vi.fn();
  viewportManager.subscribe('some-group', listener);

  viewportManager.update('some-group', VIEWPORT, 'some-topic');

  expect(listener).toHaveBeenLastCalledWith(VIEWPORT, 'some-topic');
});
