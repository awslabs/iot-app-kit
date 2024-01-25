import { Button } from '@cloudscape-design/components';
import React from 'react';
import {
  spaceScaledXs,
  spaceScaledXxxs,
} from '@cloudscape-design/design-tokens';
import './drawer.css';
export const DrawerHeader = ({
  closed,
  setClosed,
}: {
  closed: boolean;
  setClosed: (closed: boolean) => void;
}) => {
  return (
    <div
      className={`drawer-container ${closed ? 'drawer-container-hover' : ''}`}
    >
      <h3>Data streams</h3>
      <div className='drawer-pull-right'>
        {!closed && (
          <span
            className='drawer-collapse-button-divider'
            style={{
              padding: `${spaceScaledXxxs} ${spaceScaledXs} ${spaceScaledXxxs} 0`,
            }}
          />
        )}
        <Button
          variant='icon'
          iconName={closed ? 'angle-up' : 'angle-down'}
          onClick={() => setClosed(!closed)}
        />
      </div>
    </div>
  );
};
