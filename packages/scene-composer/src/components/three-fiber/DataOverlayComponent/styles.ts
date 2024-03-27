import { colorBackgroundContainerHeader, colorBorderButtonNormalDisabled } from '@cloudscape-design/design-tokens';
import { CSSProperties } from 'react';

// DataRow
export const tmAnnotationRow: CSSProperties = {
  whiteSpace: 'nowrap',
};

// Rows
export const tmPanelRows: CSSProperties = {
  marginLeft: '1em',
  marginRight: '1em',
};

// Container
export const tmContainer: CSSProperties = {
  overflow: 'auto',
  backgroundColor: colorBackgroundContainerHeader,
  border: `1px solid ${colorBorderButtonNormalDisabled}`,
  borderRadius: '2px',
  boxShadow: '0px 1px 4px -2px rgba(0, 28, 36, 0.5)',
};
export const tmPanelContainer: CSSProperties = {
  paddingTop: '12px',
  paddingBottom: '12px',
  width: '210px',
  minHeight: '2em',
};
export const tmAnnotationContainer: CSSProperties = {
  paddingLeft: '12px',
  paddingRight: '12px',
};
export const tmCloseButtonDiv: CSSProperties = {
  float: 'right',
  marginTop: '8px',
  marginRight: '8px',
};
export const tmCloseButton: CSSProperties = {
  backgroundColor: 'transparent',
  borderColor: 'transparent',
  color: 'white',
};

// Overlay panel arrow
export const tmArrow: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};
export const tmArrowOuter: CSSProperties = {
  width: '18px',
  height: '18px',
  position: 'absolute',
  zIndex: -1,
  bottom: '-9px',
  transform: 'rotate(45deg)',
};
export const tmArrowInner: CSSProperties = {
  border: '0px',
  bottom: '-7.5px',
  width: '20px',
  height: '20px',
  zIndex: '1',
  boxShadow: 'none',
};
