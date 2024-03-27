import { colorBackgroundHomeHeader } from '@cloudscape-design/design-tokens';
import { CSSProperties } from 'react';

export const tmIconPickerPopover: CSSProperties = {
  position: 'absolute',
  zIndex: 1,
  top: '100%',
  left: '80%',
  width: '170%', //this to not allow the container to shrink when search results are less than 8 and keep the min width equal to the width for 8 icons which is the chosen # of icons per row.
  transform: 'translateX(-40%)',
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
