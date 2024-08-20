import React from 'react';
import { render, screen } from '@testing-library/react';
import { ActionPanel, ActionPanelProps } from './actionPanel';
import userEvent from '@testing-library/user-event';

const component = (props?: ActionPanelProps) => (
  <ActionPanel {...props}>
    <div
      data-testid='childComponent'
      style={{ width: '400px', height: '300px' }}
    />
  </ActionPanel>
);

describe('ActionPanel', () => {
  it('renders with component', () => {
    expect(() => {
      render(component());
    }).not.toThrowError();
  });

  it('renders with defined width and height', () => {
    expect(() => {
      render(component({ width: '500px', height: '500px' }));
    }).not.toThrowError();
  });

  it('renders when action panel is on the left', () => {
    expect(() => {
      render(component({ position: 'left' }));
    }).not.toThrowError();
  });

  it('selects and unselects component on component click', async () => {
    const user = userEvent.setup();
    render(component());

    await user.click(screen.getByTestId('childComponent'));
    await user.click(screen.getByTestId('action-panel-menu-button'));
    expect(
      screen.getByTestId('action-panel-summarize-button')
    ).toBeInTheDocument();

    await user.click(screen.getByTestId('childComponent'));
    expect(screen.queryByTestId('action-panel-summarize-button')).toBeNull();
  });

  it('opens assistant action dropdown menu on button click', async () => {
    const user = userEvent.setup();
    render(component());

    await user.click(screen.getByTestId('childComponent'));
    await user.click(screen.getByTestId('action-panel-menu-button'));
    expect(
      screen.getByTestId('action-panel-summarize-button')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('action-panel-chatbot-button')
    ).toBeInTheDocument();
  });

  it('closes action dropdown on action item click', async () => {
    const user = userEvent.setup();
    render(component());

    await user.click(screen.getByTestId('childComponent'));
    await user.click(screen.getByTestId('action-panel-menu-button'));
    await user.click(screen.getByTestId('action-panel-summarize-button'));
    expect(screen.queryByTestId('action-panel-summarize-button')).toBeNull();

    await user.click(screen.getByTestId('action-panel-menu-button'));
    await user.click(screen.getByTestId('action-panel-chatbot-button'));
    expect(screen.queryByTestId('action-panel-chatbot-button')).toBeNull();
  });

  it('select panel when customer type enter', async () => {
    const user = userEvent.setup();
    render(component());

    user.type(screen.getByTestId('action-panel-children'), '{enter}');
    expect(
      screen.getByText('1 panel selected')
    ).toBeInTheDocument();
  });
});
