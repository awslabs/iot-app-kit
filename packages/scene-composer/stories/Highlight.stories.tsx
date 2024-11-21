import type { Meta, StoryObj } from '@storybook/react';
import { COMPOSER_FEATURES } from '../src/interfaces/feature';
import HighlightTestWrapper from './components/highlightTestWrapper';
import { argTypes } from './components/scene-viewer';

export default {
  title: 'Tests/Scene Viewer Highlight',
  component: HighlightTestWrapper,
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
} satisfies Meta<typeof HighlightTestWrapper>;

type Story = StoryObj<typeof HighlightTestWrapper>;

export const Highlights: Story = {
  parameters: {
    docs: { inlineStories: false, iframeHeight: '500px' },
    controls: { include: ['onSelectionChanged', 'onWidgetClick'], hideNoControlsWarning: true },
  },
  args: {
    scene: 'CookieFactoryWaterTank',
  },
};
