import React from 'react';
import { act, render, screen } from '@testing-library/react';

import { CollapsiblePanel } from './collapsiblePanel';
import { DEFAULT_SIDE_PANE_WIDTH } from '../resizablePanes/constants';

const panelContent = `Temperature monitoring`;

const panelWidth = DEFAULT_SIDE_PANE_WIDTH;

const mockIcon = 'mockIcon';
const headerText = 'Configuration';

describe('CollapsiblePanel', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should open collapsed panel when icon is clicked', async () => {
    const side = 'right';
    let isPanelCollapsed = true;
    const onCollapsedPanelClick = jest
      .fn()
      .mockImplementation(() => (isPanelCollapsed = !isPanelCollapsed));
    const collapsedElement = (
      <CollapsiblePanel
        isPanelCollapsed={isPanelCollapsed}
        panelWidth={panelWidth}
        onCollapsedPanelClick={onCollapsedPanelClick}
        panelContent={panelContent}
        icon={mockIcon}
        side={side}
        headerText={headerText}
      />
    );

    render(collapsedElement);

    // Assert collapsed panel content
    const iconButton = screen.getByTestId(`collapsed-${side}-panel-icon`);
    expect(iconButton).toHaveAttribute('src', mockIcon);

    act(() => {
      iconButton.click();
    });

    // Assert panel expanded
    expect(isPanelCollapsed).toBe(false);
  });

  it('should close expanded panel when button is clicked', async () => {
    const side = 'left';
    let isPanelCollapsed = false;
    const onCollapsedPanelClick = jest
      .fn()
      .mockImplementation(() => (isPanelCollapsed = !isPanelCollapsed));
    const collapsedElement = (
      <CollapsiblePanel
        isPanelCollapsed={isPanelCollapsed}
        panelWidth={panelWidth}
        onCollapsedPanelClick={onCollapsedPanelClick}
        panelContent={panelContent}
        icon={mockIcon}
        side={side}
        headerText={headerText}
      />
    );

    render(collapsedElement);

    // Assert expanded panel content
    expect(screen.getByText(headerText)).toBeVisible();
    const collapseButton = screen.getByTestId(`expanded-${side}-panel-button`);
    expect(collapseButton).toBeVisible();

    act(() => {
      collapseButton.click();
    });

    // Assert panel collapsed
    expect(isPanelCollapsed).toBe(true);
  });
});
