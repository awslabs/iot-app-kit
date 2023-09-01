import { colorBackgroundHomeHeader } from '@awsui/design-tokens';
import { CSSProperties } from 'react';

export const tmIconPickerPopover: CSSProperties = {
  position: 'absolute',
  zIndex: 1,
  top: '100%',
  left: '80%',
  transform: 'translateX(-50%)',
  background: colorBackgroundHomeHeader,
  borderRadius: '25px',
  padding: '20px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
  border: `1px solid ${colorBackgroundHomeHeader}`,
  overflow: 'visible',
};

export const tmIconPickerContainer: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const iconWidth = 197;
export const iconHeight = 512;
export const IconGridLayout: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(8, 1fr)', // Adjust the number of columns as needed
  gap: '20px', // Adjust the gap between icons
  maxHeight: '500px', // Adjust the maximum height of the grid
  overflowY: 'auto',
};
