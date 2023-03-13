import React from 'react';
import './ErrorBadge.css';
import type { ReactNode } from 'react';

interface ErrorBadgeProps {
  children: ReactNode;
}

export const ErrorBadge: React.FC<ErrorBadgeProps> = ({ children }) => (
  <div data-test-tag='error'>
    <span className='warning-symbol'>⚠</span>
    {children}
  </div>
);
