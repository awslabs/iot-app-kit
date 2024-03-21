import Button from '@cloudscape-design/components/button';
import React from 'react';

export const LoadingIcon = ({ loading }: { loading?: boolean }) => {
  if (!loading) return null;

  return (
    <div style={{ position: 'absolute', right: 8, bottom: 2, zIndex: 1 }}>
      <Button loading variant='icon' loadingText='Loading'>
        Loading
      </Button>
    </div>
  );
};
