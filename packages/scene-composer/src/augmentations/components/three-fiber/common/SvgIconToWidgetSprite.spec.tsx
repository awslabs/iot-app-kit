import { create } from 'react-test-renderer';

import { DefaultAnchorStatus, SelectedAnchor } from '../../../..';
import {
  ErrorIconSvgString,
  InfoIconSvgString,
  SelectedIconSvgString,
  VideoIconSvgString,
  WarningIconSvgString,
} from '../../../../assets';

import svgIconToWidgetSprite from './SvgIconToWidgetSprite';

describe('svgIconToWidgetSprite', () => {
  const icons = [
    ['Selected', { key: SelectedAnchor, icon: SelectedIconSvgString }],
    ['Info', { key: DefaultAnchorStatus.Info, icon: InfoIconSvgString }],
    ['Warning', { key: DefaultAnchorStatus.Warning, icon: WarningIconSvgString }],
    ['Error', { key: DefaultAnchorStatus.Error, icon: ErrorIconSvgString }],
    ['Video', { key: DefaultAnchorStatus.Video, icon: VideoIconSvgString }],
  ];
  interface Icons {
    key: string;
    icon: string;
  }
  icons.forEach((value) => {
    it(`it should render the ${value[0]} correctly`, () => {
      vi.spyOn(window.Math, 'random').mockReturnValue(0.1);
      const { key, icon } = value[1] as Icons;
      const container = create(svgIconToWidgetSprite(icon, key, key, false, true));

      expect(container).toMatchSnapshot();
    });
  });

  icons.forEach((value) => {
    it(`it should render the always visible ${value[0]} correctly`, () => {
      vi.spyOn(window.Math, 'random').mockReturnValue(0.1);
      const { key, icon } = value[1] as Icons;
      const container = create(svgIconToWidgetSprite(icon, key, key, true, true));

      expect(container).toMatchSnapshot();
    });
  });

  icons.forEach((value) => {
    it(`it should render the constant sized ${value[0]} correctly`, () => {
      vi.spyOn(window.Math, 'random').mockReturnValue(0.1);
      const { key, icon } = value[1] as Icons;
      const container = create(svgIconToWidgetSprite(icon, key, key, false, false));

      expect(container).toMatchSnapshot();
    });
  });
});
