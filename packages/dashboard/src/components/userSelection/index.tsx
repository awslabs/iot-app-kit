import type { Rectangle } from '~/types';
import { useLayers } from '../internalDashboard/useLayers';
import './index.css';

export interface UserSelectionProps {
  rectangle: Rectangle | undefined;
}

export const UserSelection = ({ rectangle }: UserSelectionProps) => {
  const { userSelectionLayer } = useLayers();

  if (!rectangle) {
    return null;
  }

  return (
    <div
      className='select-rect'
      style={{
        left: `${rectangle.x}px`,
        top: `${rectangle.y}px`,
        width: `${rectangle.width}px`,
        height: `${rectangle.height}px`,
        zIndex: userSelectionLayer,
      }}
    />
  );
};
