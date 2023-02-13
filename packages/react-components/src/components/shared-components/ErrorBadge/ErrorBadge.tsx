import React from 'react';
import './ErrorBadge.css';

export const ErrorBadge: React.FC = ({ children }) => (
  <div data-test-tag="error">
    <span className="warning-symbol">⚠</span>
    {children}
  </div>
);
