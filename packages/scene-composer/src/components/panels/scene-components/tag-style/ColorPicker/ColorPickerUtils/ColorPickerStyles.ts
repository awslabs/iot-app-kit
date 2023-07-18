import { CSSObject, CSSProperties } from 'styled-components';

export const tmColorPickerPopover: CSSProperties = {
  position: 'absolute',
  zIndex: 1,
  top: '100%',
  left: '50%',
  transform: 'translateX(-50%)',
  background: '#21252c',
  borderRadius: '4px',
  padding: '10px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
  border: '1px solid #000',
};

export const tmClose: CSSProperties = {
  position: 'absolute',
  top: '3px',
  right: '1px',
};

export const tmClosePopover: CSSProperties = {
  position: 'absolute',
  top: '0',
  bottom: '0',
  left: '0',
  right: '0',
};

export const tmColorPickerContainer: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const tmDivider: CSSProperties = {
  width: '100%',
  height: '1px',
  background: '#ccc',
  margin: '8px 0',
};

export const tmAddButton: CSSProperties = {
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#ccc',
  color: '#fff',
  fontWeight: 'bold',
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

