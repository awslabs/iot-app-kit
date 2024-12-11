import {
  colorBorderSegmentDefault,
  fontSizeBodyM,
} from '@cloudscape-design/design-tokens';
import { memo } from 'react';
import styled from 'styled-components';

export const DashboardEmptyState = memo(() => {
  return (
    <StyledEmptyState>
      <svg
        width='40'
        height='40'
        viewBox='0 0 40 40'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <rect
          x='1'
          y='1'
          width='38'
          height='38'
          rx='7'
          stroke='#414D5C'
          stroke-width='2'
        />
        <path
          d='M10.25 10.1001V29.6001C10.25 29.6829 10.3172 29.7501 10.4 29.7501H29.9'
          stroke='#414D5C'
          stroke-width='2'
          stroke-linecap='square'
        />
        <path
          d='M29.417 16.084L23.6894 21.8116C23.6308 21.8701 23.5359 21.8701 23.4773 21.8116L19.6395 17.9738C19.581 17.9152 19.486 17.9152 19.4274 17.9738L13.6998 23.7014'
          stroke='#414D5C'
          stroke-width='2'
          stroke-linecap='square'
        />
        <circle cx='19' cy='18' r='2' fill='#414D5C' />
        <circle cx='29' cy='16' r='2' fill='#414D5C' />
        <circle cx='13' cy='24' r='2' fill='#414D5C' />
        <circle cx='24' cy='22' r='2' fill='#414D5C' />
      </svg>

      <EmptyStateText>Drag and drop your widget in the canvas.</EmptyStateText>
    </StyledEmptyState>
  );
});

const EMPTY_STATE_HEIGHT_PX = 200;
const EMPTY_STATE_WIDTH_PX = 300;

const StyledEmptyState = styled.div`
  position: absolute;
  top: calc(50% - ${EMPTY_STATE_HEIGHT_PX / 2}px);
  left: calc(50% - ${EMPTY_STATE_WIDTH_PX / 2}px);
  height: ${EMPTY_STATE_HEIGHT_PX}px;
  width: ${EMPTY_STATE_WIDTH_PX}px;
  border: 3px dashed ${colorBorderSegmentDefault};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  padding: 50px 50px;
  z-index: 1000;
`;

const EmptyStateText = styled.p`
  text-align: center;
  font-size: ${fontSizeBodyM};
`;
