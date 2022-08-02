import renderer from 'react-test-renderer';
import React from 'react';

import { DefaultAnchorStatus, SelectedAnchor } from '../../../../../src';
import {
  ErrorIconSvgString,
  InfoIconSvgString,
  SelectedIconSvgString,
  VideoIconSvgString,
  WarningIconSvgString,
} from '../../../../../src/assets';
import svgIconToWidgetSprite from '../../../../../src/augmentations/components/three-fiber/common/SvgIconToWidgetSprite';

describe('svgIconToWidgetSprite', () => {
  [
    ['Selected', { key: SelectedAnchor, icon: SelectedIconSvgString }, false],
    ['Info', { key: DefaultAnchorStatus.Info, icon: InfoIconSvgString }, false],
    ['Warning', { key: DefaultAnchorStatus.Warning, icon: WarningIconSvgString }, false],
    ['Error', { key: DefaultAnchorStatus.Error, icon: ErrorIconSvgString }, false],
    ['Video', { key: DefaultAnchorStatus.Video, icon: VideoIconSvgString }, false],
    ['Selected', { key: SelectedAnchor, icon: SelectedIconSvgString }, true],
    ['Info', { key: DefaultAnchorStatus.Info, icon: InfoIconSvgString }, true],
    ['Warning', { key: DefaultAnchorStatus.Warning, icon: WarningIconSvgString }, true],
    ['Error', { key: DefaultAnchorStatus.Error, icon: ErrorIconSvgString }, true],
    ['Video', { key: DefaultAnchorStatus.Video, icon: VideoIconSvgString }, true],
  ].forEach((value) => {
    it(`it should render the ${value[2] ? 'always visible' : ''} ${value[0]} correctly`, () => {
      jest.spyOn(window.Math, 'random').mockReturnValue(0.1);
      const { key, icon } = value[1] as any;
      const container = renderer.create(svgIconToWidgetSprite(icon, key, value[2] as boolean));

      expect(container).toMatchSnapshot();
    });
  });
});
