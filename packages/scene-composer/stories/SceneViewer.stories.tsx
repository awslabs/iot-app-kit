import type { Meta, StoryObj } from '@storybook/react';
import { useCallback, useState } from 'react';
import { COMPOSER_FEATURES } from '../src/interfaces/feature';
import SceneViewer, { argTypes } from './components/scene-viewer';

export default {
  title: 'Tests/Scene Viewer',
  component: SceneViewer,
  argTypes,
  args: {
    source: 'local',
    scene: 'scene1',
    // @ts-expect-error type is wrong?
    theme: 'dark',
    mode: 'Viewing',
    density: 'comfortable',
    features: [COMPOSER_FEATURES.Matterport],
  },
} satisfies Meta<typeof SceneViewer>;

type Story = StoryObj<typeof SceneViewer>;

export const MotionIndicator: Story = {
  parameters: {
    docs: { inlineStories: false, iframeHeight: '500px' },
    controls: { include: ['onSelectionChanged', 'onWidgetClick'], hideNoControlsWarning: true },
  },
  args: {
    scene: 'CookieFactoryWaterTank',
    sceneComposerId: 'motion-indicator-view-options',
  },
};

export const Remounting: Story = {
  parameters: {
    docs: { inlineStories: false, iframeHeight: '500px' },
    controls: { include: ['onSelectionChanged', 'onWidgetClick'], hideNoControlsWarning: true },
  },
  args: {
    scene: 'CookieFactoryWaterTank',
  },
  decorators: [
    (Story) => {
      const [isMounted, setIsMounted] = useState(true);
      const toggleVisibility = useCallback(() => {
        setIsMounted(!isMounted);
      }, [isMounted]);
      return (
        <div>
          <label>
            <input type='checkbox' onChange={toggleVisibility} checked={isMounted} />
            mounted
          </label>
          <div style={{ position: 'relative', height: '100vh' }}>{isMounted && <Story />}</div>
        </div>
      );
    },
  ],
};
