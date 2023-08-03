import { describe, expect } from '@jest/globals';
import { render } from '@testing-library/react';
import React from 'react';
import ChartContextMenu from './ChartContextMenu';

describe('ChartContextMenu', () => {
  const menuOptionClickHandler = jest.fn();
  const onOutSideClickHandler = jest.fn();
  const component = render(
    <ChartContextMenu
      menuOptionClickHandler={menuOptionClickHandler}
      onOutSideClickHandler={onOutSideClickHandler}
      position={{ x: 100, y: 100 }}
      trendCursors={[]}
    />
  );
  it('renders', () => {
    expect(component).not.toBeNull();
  });
});
