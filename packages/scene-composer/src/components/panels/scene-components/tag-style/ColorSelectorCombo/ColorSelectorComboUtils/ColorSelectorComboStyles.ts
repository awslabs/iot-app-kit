import { colorBackgroundHomeHeader, colorChartsStatusNeutral } from '@cloudscape-design/design-tokens';
import { CSSProperties } from 'styled-components';

export const tmColorPickerPopover: CSSProperties = {
  position: 'absolute',
  zIndex: 1,
  top: '100%',
  left: '50%',
  transform: 'translateX(-50%)',
  background: colorBackgroundHomeHeader,
  borderRadius: '25px',
  padding: '10px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
  border: `1px solid ${colorBackgroundHomeHeader}`,
};

export const tmColorPickerContainer: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const tmAddButton: CSSProperties = {
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: colorChartsStatusNeutral,
  color: 'white',
  fontWeight: 'bold',
};
export const tmDivider: CSSProperties = {
  width: '100%',
  height: '1px',
  background: colorChartsStatusNeutral,
  margin: '8px 0',
};
export const tmPopover: CSSProperties = {
  position: 'absolute',
  zIndex: '2',
};
export const tmCover: CSSProperties = {
  position: 'fixed',
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px',
};
