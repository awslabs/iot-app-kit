import type { Meta, StoryObj } from '@storybook/react';
import { COMPOSER_FEATURES } from '../../src/interfaces/feature';
import SceneViewer, { argTypes } from '../components/scene-viewer';

export default {
  title: 'Developer/Scene Viewer',
  component: SceneViewer,
  argTypes,
  args: {
    source: 'local',
    scene: 'scene_1',
    // @ts-expect-error type is wrong?
    density: 'comfortable',
    features: [
      COMPOSER_FEATURES.Matterport,
      COMPOSER_FEATURES.SceneAppearance,
      COMPOSER_FEATURES.DynamicScene,
      COMPOSER_FEATURES.Textures,
    ],
  },
} satisfies Meta<typeof SceneViewer>;

type Story = StoryObj<typeof SceneViewer>;

export const LocalScene: Story = {
  parameters: { docs: { inlineStories: false, iframeHeight: '500px' } },
};

export const AWSScene: Story = {
  parameters: { docs: { inlineStories: false, iframeHeight: '500px' } },
  args: { source: 'aws' },
};
