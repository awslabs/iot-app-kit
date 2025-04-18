import { type Meta, type StoryObj } from '@storybook/react';
import { TimeSelection, TimeSync, useViewport } from '../../src';

export default {
  title: 'Builder Components/TimeSync/TimeSync',
  component: TimeSync,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof TimeSync>;

type Story = StoryObj<typeof TimeSync>;

const INITIAL_VIEWPORT = { duration: '5m' };

const ViewportConsumer = () => {
  const { viewport, setViewport } = useViewport();

  const chooseRandomViewport = () => {
    setViewport({
      start: new Date(new Date(1900, 0, 0).getTime() + 100000 * Math.random()),
      end: new Date(new Date(2000, 0, 0).getTime() + 100000 * Math.random()),
    });
  };

  return (
    <div>
      Current viewport:
      <code>{JSON.stringify(viewport)}</code>
      <button onClick={chooseRandomViewport}>Choose random viewport</button>
    </div>
  );
};

export const Main: Story = {
  render: () => {
    return (
      <TimeSync group='single-group' initialViewport={INITIAL_VIEWPORT}>
        <TimeSelection />
        <ViewportConsumer />
        <ViewportConsumer />
        <ViewportConsumer />
        <ViewportConsumer />
        <ViewportConsumer />
      </TimeSync>
    );
  },
};

export const MultipleTimeSyncs: Story = {
  render: () => {
    return (
      <div>
        <TimeSync group='group-1' initialViewport={INITIAL_VIEWPORT}>
          <TimeSelection />
          <h1>Group 1</h1>
          <ViewportConsumer />
          <ViewportConsumer />
          <ViewportConsumer />
        </TimeSync>
        <TimeSync group='group-2' initialViewport={INITIAL_VIEWPORT}>
          <TimeSelection />
          <h1>Group 2</h1>
          <ViewportConsumer />
          <ViewportConsumer />
          <ViewportConsumer />
        </TimeSync>
        <TimeSync group='group-3' initialViewport={INITIAL_VIEWPORT}>
          <TimeSelection />
          <h1>Group 3</h1>
          <ViewportConsumer />
          <ViewportConsumer />
          <ViewportConsumer />
        </TimeSync>
      </div>
    );
  },
};

export const MultipleTimeSyncSameGroup: Story = {
  render: () => {
    return (
      <div>
        <TimeSync group='group-1' initialViewport={INITIAL_VIEWPORT}>
          <TimeSelection />
          <h1>Group 1</h1>
          <ViewportConsumer />
          <ViewportConsumer />
          <ViewportConsumer />
        </TimeSync>
        <TimeSync group='group-1' initialViewport={INITIAL_VIEWPORT}>
          <TimeSelection />
          <h1>Group 2</h1>
          <ViewportConsumer />
          <ViewportConsumer />
          <ViewportConsumer />
        </TimeSync>
        <TimeSync group='group-1' initialViewport={INITIAL_VIEWPORT}>
          <TimeSelection />
          <h1>Group 3</h1>
          <ViewportConsumer />
          <ViewportConsumer />
          <ViewportConsumer />
        </TimeSync>
      </div>
    );
  },
};
