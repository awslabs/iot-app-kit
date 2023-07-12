import { CSSProperties } from 'styled-components';

export const tmColorPickerPopover: CSSProperties = {
  position: 'absolute',
  zIndex: 1,
  top: '100%',
  left: '50%',
  transform: 'translateX(-50%)',
  background: '#21252c',
  borderRadius: '4px',
  padding: '23px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
};

export const tmClose: CSSProperties = {
  position: 'absolute',
  top: '3px',
  right: '1px',
};
