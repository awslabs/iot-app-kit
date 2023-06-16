import { render, screen } from '@testing-library/react';
import React from 'react';

import { PropertiesPanel } from './propertiesPanel';

const useSelectionMock = jest.fn();
jest.mock('~/customization/propertiesSection', () => ({
  useSelection: () => useSelectionMock(),
}));

describe(`${PropertiesPanel.name}`, () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render section elements when a widget is selected', () => {
    useSelectionMock.mockReturnValueOnce([]);
    render(<PropertiesPanel sections={[<div key='test-key'>test section</div>]} />);

    expect(screen.getByText('Configuration')).toBeVisible();
    expect(screen.getByText('test section')).toBeVisible();
    expect(screen.queryByText('Select widgets to configure.')).not.toBeInTheDocument();
  });

  it('should not render section elements when there are no section selements, yet a widget is selected', () => {
    useSelectionMock.mockReturnValueOnce([]);
    render(<PropertiesPanel sections={[]} />);

    expect(screen.getByText('Configuration')).toBeVisible();
    expect(screen.queryByText('test section')).not.toBeInTheDocument();
    expect(screen.queryByText('Select widgets to configure.')).not.toBeInTheDocument();
  });

  it('should render an empty state when no widgets are selected', () => {
    useSelectionMock.mockReturnValueOnce(undefined);
    render(<PropertiesPanel sections={[]} />);

    expect(screen.getByText('Select widgets to configure.')).toBeVisible();
    expect(screen.queryByText('Configuration')).not.toBeInTheDocument();
  });
});
