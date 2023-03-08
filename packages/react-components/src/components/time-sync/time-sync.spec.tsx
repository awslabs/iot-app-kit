import React from 'react';
import { viewportManager } from '@iot-app-kit/core';
import { render, screen } from '@testing-library/react';
import { TimeSync } from './index';
import { useViewport } from '../../hooks/useViewport/useViewport';

afterEach(() => {
  viewportManager.reset();
  jest.clearAllMocks();
});

describe('subscribes to group', () => {
  it('subscribes to viewport group when provided explicit group', () => {
    const group = 'my-group';
    const subscribe = jest.spyOn(viewportManager, 'subscribe');
    render(<TimeSync group={group}>'</TimeSync>);

    expect(subscribe).toBeCalledTimes(1);
    expect(subscribe).toBeCalledWith(group, expect.any(Function));
  });

  it('subscribes to new group when group is updated', () => {
    const group = 'my-group';
    const group2 = 'my-group-2';
    const subscribe = jest.spyOn(viewportManager, 'subscribe');

    const { rerender } = render(<TimeSync group={group}>'</TimeSync>);
    rerender(<TimeSync group={group2}>'</TimeSync>);

    expect(subscribe).toBeCalledTimes(2);
    expect(subscribe).toHaveBeenLastCalledWith(group2, expect.any(Function));
  });

  it('subscribes to viewport group when provided no explicit group', () => {
    const subscribe = jest.spyOn(viewportManager, 'subscribe');
    render(<TimeSync>'</TimeSync>);

    expect(subscribe).toBeCalledTimes(1);
    expect(subscribe).toBeCalledWith(expect.any(String), expect.any(Function));
  });
});

describe('updates to viewport group', () => {
  it('sets viewport for group when previously undefined to the initial viewport provided', () => {
    const VIEWPORT = { duration: '5d' };
    const GROUP = 'group-123';
    const update = jest.spyOn(viewportManager, 'update');
    render(
      <TimeSync group={GROUP} initialViewport={VIEWPORT}>
        '
      </TimeSync>
    );

    expect(update).toBeCalledTimes(1);
    expect(update).toBeCalledWith(GROUP, VIEWPORT);
  });

  it('sets viewport for group when previously undefined to the default viewport when no initial viewport provided', () => {
    const GROUP = 'group-123';
    const update = jest.spyOn(viewportManager, 'update');
    render(<TimeSync group={GROUP}>'</TimeSync>);

    expect(update).toBeCalledTimes(1);
    expect(update).toBeCalledWith(GROUP, { duration: '6h' });
  });
});

it('provides viewport through useViewport', () => {
  const group = 'some-group';
  const viewport = { start: new Date(2000, 0, 0), end: new Date(2010, 0, 0) };
  viewportManager.update(group, viewport);

  const ViewportUser = () => {
    const { viewport } = useViewport();
    return <>{JSON.stringify(viewport)}</>;
  };

  render(
    <TimeSync group={group}>
      <ViewportUser />
    </TimeSync>
  );

  expect(screen.queryByText(JSON.stringify(viewport))).not.toBeNull();
});
