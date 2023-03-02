import React from 'react';

import { Rect } from '~/types';
import { useLayers } from '../internalDashboard/useLayers';

import './index.css';

export type UserSelectionProps = {
  rect: Rect | undefined;
};

const UserSelection: React.FC<UserSelectionProps> = ({ rect }) => {
  const { userSelectionLayer } = useLayers();

  return rect ? (
    <div
      className='select-rect'
      style={{
        left: `${rect.x}px`,
        top: `${rect.y}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        zIndex: userSelectionLayer,
      }}
    ></div>
  ) : null;
};

export default UserSelection;
