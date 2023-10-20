import { beforeEach, describe, expect } from '@jest/globals';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import React from 'react';
import ChartContextMenu from './ChartContextMenu';

import { InternalGraphicComponentGroupOption } from '../trendCursor/types';

describe('ChartContextMenu', () => {
  const menuOptionClickHandler = jest.fn();
  const onOutSideClickHandler = jest.fn();
  let component: RenderResult;
  beforeEach(() => {
    component = render(
      <ChartContextMenu
        menuOptionClickHandler={menuOptionClickHandler}
        onOutSideClickHandler={onOutSideClickHandler}
        position={{ x: 100, y: 100 }}
        trendCursors={[{} as InternalGraphicComponentGroupOption]}
      />
    );
  });

  it('renders', () => {
    expect(component).not.toBeNull();
  });

  it('menuOptionClickHandler should be called with add when "Add trend cursor" is clicked', () => {
    const { getByText } = component;
    const clickIndicator = getByText('Add trend cursor');
    fireEvent.click(clickIndicator);
    expect(menuOptionClickHandler).toBeCalledWith(
      expect.objectContaining({
        action: 'add',
      })
    );
  });

  it('menuOptionClickHandler should be called with delete when "Delete trend cursor" is clicked', () => {
    const { getByText } = component;
    const clickIndicator = getByText('Delete trend cursor');
    fireEvent.click(clickIndicator);
    expect(menuOptionClickHandler).toBeCalledWith(
      expect.objectContaining({
        action: 'delete',
      })
    );
  });

  it('menuOptionClickHandler should be called with copy when "Copy to clipboard" is clicked', () => {
    const { getByText } = component;
    const clickIndicator = getByText('Copy to clipboard');
    fireEvent.click(clickIndicator);
    expect(menuOptionClickHandler).toBeCalledWith(
      expect.objectContaining({
        action: 'copy',
      })
    );
  });

  it('menuOptionClickHandler cannot be called with delete when graphic.length  is <= 0', () => {
    const { getAllByText } = render(
      <ChartContextMenu
        menuOptionClickHandler={menuOptionClickHandler}
        onOutSideClickHandler={onOutSideClickHandler}
        position={{ x: 100, y: 100 }}
        trendCursors={[]}
      />
    );
    const clickIndicator = getAllByText('Delete trend cursor')[0];
    fireEvent.click(clickIndicator);
    expect(menuOptionClickHandler).not.toBeCalledWith();
  });

  it('menuOptionClickHandler cannot be called with add when graphic.length > 5', () => {
    const { getAllByText } = render(
      <ChartContextMenu
        menuOptionClickHandler={menuOptionClickHandler}
        onOutSideClickHandler={onOutSideClickHandler}
        position={{ x: 100, y: 100 }}
        trendCursors={[
          {} as InternalGraphicComponentGroupOption,
          {} as InternalGraphicComponentGroupOption,
          {} as InternalGraphicComponentGroupOption,
          {} as InternalGraphicComponentGroupOption,
          {} as InternalGraphicComponentGroupOption,
        ]}
      />
    );
    const clickIndicator = getAllByText('Add trend cursor')[0];
    fireEvent.click(clickIndicator);
    expect(menuOptionClickHandler).not.toBeCalledWith();
  });
});
