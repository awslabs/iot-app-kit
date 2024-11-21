import type { Meta, StoryObj } from '@storybook/react';
import { COMPOSER_FEATURES } from '../src/interfaces/feature';
import SceneComposer, { argTypes } from './components/scene-composer';

export default {
  title: 'Tests/FirstPerson',
  component: SceneComposer,
  argTypes,
  args: {
    source: 'local',
    scene: 'scene1',
    // @ts-expect-error type is wrong?
    assetType: 'GLB',
    theme: 'dark',
    mode: 'Viewing',
    density: 'comfortable',
    features: [COMPOSER_FEATURES.FirstPerson],
  },
} satisfies Meta<typeof SceneComposer>;

type Story = StoryObj<typeof SceneComposer>;

export const LocalViewer: Story = {
  parameters: {
    docs: {
      inlineStories: false,
      iframeHeight: '500px',
    },
    controls: {
      include: ['onSelectionChanged', 'onWidgetClick'],
      hideNoControlsWarning: true,
    },
  },
};

export const AWSViewer: Story = {
  parameters: {
    docs: {
      inlineStories: false,
      iframeHeight: '500px',
    },
  },
  args: {
    source: 'aws',
  },
};
