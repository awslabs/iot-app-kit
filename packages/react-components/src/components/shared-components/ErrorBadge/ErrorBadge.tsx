import React from 'react';
import styled from 'styled-components';

import type { ReactNode } from 'react';

interface ErrorBadgeProps {
  children: ReactNode;
}

const ErrorContainer = styled.div`
  display: flex;
`;

const WarningSymbol = styled.span`
  padding: 3px;
`;

export const ErrorBadge: React.FC<ErrorBadgeProps> = ({ children }) => (
  <ErrorContainer>
    <WarningSymbol>⚠</WarningSymbol>
    {children}
  </ErrorContainer>
);
