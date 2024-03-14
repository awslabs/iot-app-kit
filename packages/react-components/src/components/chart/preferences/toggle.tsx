import React from 'react';
import Button from '@cloudscape-design/components/button';

export const PreferencesModalToggle = ({ onShow }: { onShow: () => void }) => {
  return (
    <div style={{ position: 'absolute', right: 26, top: 6 }}>
      <Button iconName='ellipsis' variant='icon' onClick={onShow} />
    </div>
  );
};
