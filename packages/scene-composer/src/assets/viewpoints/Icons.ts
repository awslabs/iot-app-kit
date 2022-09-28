import {
  SelectedViewpointSvgString,
  ViewCursorEditSvgString,
  ViewCursorMoveSvgString,
  ViewpointSvgString,
} from './IconSvgs';

export class Svg {
  protected defaultSvg: string;

  constructor(defaultSvg: string) {
    this.defaultSvg = defaultSvg;
  }

  get dataUri(): string {
    return `data:image/svg+xml, ${encodeURI(this.defaultSvg)}`;
  }
}

export const ViewpointIcon = new Svg(ViewpointSvgString);
export const SelectedViewpointIcon = new Svg(SelectedViewpointSvgString);
export const ViewCursorMoveIcon = new Svg(ViewCursorMoveSvgString);
export const ViewCursorEditIcon = new Svg(ViewCursorEditSvgString);
