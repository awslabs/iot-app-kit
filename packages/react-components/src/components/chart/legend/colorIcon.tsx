import React from 'react';

export const ColorIcon = ({ color }: { color: string }) => (
  <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
    <div
      style={{
        height: '4px',
        borderRadius: '6px',
        width: '15px',
        backgroundColor: color,
      }}
    />
  </div>
);
