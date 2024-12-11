import {
  fontSizeHeadingXl,
  lineHeightHeadingXl,
} from '@cloudscape-design/design-tokens';
import styled from 'styled-components';

export const Header = styled.div`
  border-bottom: var(--dashboard-border);
  display: flex;
  flex-direction: column;
  grid-area: header;
`;

export const DashboardName = styled.h1`
  font-size: ${fontSizeHeadingXl};
  line-height: ${lineHeightHeadingXl};
  padding: 0;
  margin: 0;
`;

export const PrimaryBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 12px;
  padding-right: 8px;
`;

export const PrimaryBarControls = styled.div`
  display: flex;
  align-items: flex-end;
  & > * + * {
    margin-left: 16px;
  }
`;

export const PrimaryBarButtonGroup = styled.div`
  padding-left: 16px;
  border-left: var(--dashboard-border);
  margin-left: 16px;
  & > * + * {
    margin-left: 8px;
  }
`;
