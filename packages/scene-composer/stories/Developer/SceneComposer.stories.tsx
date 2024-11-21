import type { Meta, StoryObj } from '@storybook/react';
import { COMPOSER_FEATURES } from '../../src/interfaces/feature';
import SceneComposer, { argTypes } from '../components/scene-composer';

export default {
  title: 'Developer/Scene Composer',
  component: SceneComposer,
  argTypes,
  args: {
    source: 'local',
    scene: 'scene_1',
    // @ts-expect-error type is wrong?
    assetType: 'GLB',
    mode: 'Editing',
    density: 'comfortable',
    features: [
      COMPOSER_FEATURES.Matterport,
      COMPOSER_FEATURES.SceneAppearance,
      COMPOSER_FEATURES.DynamicScene,
      COMPOSER_FEATURES.Textures,
    ],
  },
} satisfies Meta<typeof SceneComposer>;

type Story = StoryObj<typeof SceneComposer>;

export const LocalScene: Story = {
  parameters: { layout: 'fullscreen' },
};

export const AWSScene: Story = {
  parameters: { docs: { inlineStories: false, iframeHeight: '100vh' } },
  args: {
    source: 'aws',
  },
};
