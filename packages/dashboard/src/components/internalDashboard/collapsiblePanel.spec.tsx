import { act, render, screen } from '@testing-library/react';
import { DEFAULT_SIDE_PANE_WIDTH } from '../resizablePanes/constants';
import { CollapsiblePanel } from './collapsiblePanel';

const panelContent = `Temperature monitoring`;
const panelWidth = DEFAULT_SIDE_PANE_WIDTH;
const mockIcon = 'mockIcon';
const headerText = 'Configuration';

describe('CollapsiblePanel', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should open collapsed panel when icon is clicked', async () => {
    const side = 'right';
    let isPanelCollapsed = true;
    const onCollapsedPanelClick = vi
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

    act(() => {
      iconButton.click();
    });

    // Assert panel expanded
    expect(isPanelCollapsed).toBe(false);
  });

  it('should close expanded panel when button is clicked', async () => {
    const side = 'left';
    let isPanelCollapsed = false;
    const onCollapsedPanelClick = vi
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

  it('should not show panel header when hideHeaderWhenExpanded is truthy', async () => {
    const { queryByText } = render(
      <CollapsiblePanel
        isPanelCollapsed={false}
        panelWidth={panelWidth}
        onCollapsedPanelClick={vi.fn()}
        panelContent={panelContent}
        icon={mockIcon}
        side='left'
        headerText={headerText}
        hideHeaderWhenExpanded={true}
      />
    );

    // Assert expanded panel content
    expect(queryByText(headerText)).toBeNull();
  });

  it('should not render panel if content is null', async () => {
    const { queryByText } = render(
      <CollapsiblePanel
        isPanelCollapsed={false}
        panelWidth={panelWidth}
        onCollapsedPanelClick={vi.fn()}
        panelContent={null}
        icon={mockIcon}
        side='left'
        headerText={headerText}
      />
    );

    // Assert expanded panel content
    expect(queryByText(headerText)).toBeNull();
  });
});
