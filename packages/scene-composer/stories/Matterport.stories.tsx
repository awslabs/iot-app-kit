import type { Meta, StoryObj } from '@storybook/react';
import { COMPOSER_FEATURES } from '../src/interfaces/feature';
import SceneComposer, { argTypes } from './components/scene-composer';

export default {
  title: 'Tests/Matterport',
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
    matterportModelId: 'cZowU1FxWEQ',
    matterportApplicationKey: '',
    features: [COMPOSER_FEATURES.Matterport],
  },
} satisfies Meta<typeof SceneComposer>;

type Story = StoryObj<typeof SceneComposer>;

export const Viewer: Story = {
  parameters: {
    docs: { inlineStories: false, iframeHeight: '500px' },
    controls: {
      include: ['matterportModelId', 'matterportApplicationKey', 'onSelectionChanged', 'onWidgetClick'],
      hideNoControlsWarning: true,
    },
    args: {
      scene: 'CookieFactoryWaterTank',
    },
  },
};

export const Editor: Story = {
  parameters: {
    docs: { inlineStories: false, iframeHeight: '500px' },
    controls: {
      include: ['matterportModelId', 'matterportApplicationKey', 'onSelectionChanged', 'onWidgetClick'],
      hideNoControlsWarning: true,
    },
    args: {
      scene: 'CookieFactoryWaterTankMatterportTag',
      mode: 'Editing',
    },
  },
};
