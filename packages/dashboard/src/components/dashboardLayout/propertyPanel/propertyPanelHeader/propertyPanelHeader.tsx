import { Button } from '@cloudscape-design/components';
import React from 'react';
import './propertyPanelHeader.css';
export const PropertyPanelHeader = ({
  closed,
  setClosed,
}: {
  closed: boolean;
  setClosed: (closed: boolean) => void;
}) => {
  return (
    <div
      className={`property-panel-header-container ${
        closed ? 'property-panel-header-container-hover' : ''
      }`}
      role='button'
      tabIndex={0}
      onClick={() => {
        if (closed) {
          setClosed(false);
        }
      }}
      onKeyDown={() => {
        if (closed) {
          setClosed(false);
        }
      }}
    >
      <h3>Data streams</h3>
      <div className='property-panel-header-pull-right'>
        <Button
          variant='icon'
          iconName={closed ? 'angle-up' : 'angle-down'}
          onClick={() => setClosed(!closed)}
        />
      </div>
    </div>
  );
};
