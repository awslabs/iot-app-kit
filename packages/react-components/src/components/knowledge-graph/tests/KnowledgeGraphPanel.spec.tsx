import { type HTMLAttributes, useRef } from 'react';
import { type ElementDefinition } from 'cytoscape';
import { fireEvent } from '@testing-library/react';
import { renderWithProviders } from './utils/test-utils';
import { kgDataSource } from './__mocks__/dataSource';
import { KnowledgeGraph, ZOOM_INTERVAL } from '../KnowledgeGraphPanel';
import type { Mock } from 'vitest';

vi.mock('@cloudscape-design/components/container', () => ({
  default: (props: HTMLAttributes<HTMLDivElement>) => (
    <div data-mocked='Container' {...props}></div>
  ),
}));

vi.mock('@cloudscape-design/components/button', () => ({
  default: (props: HTMLAttributes<HTMLDivElement>) => (
    <div data-mocked='Button' {...props}></div>
  ),
}));
vi.mock('react-cytoscapejs', () => ({
  default: ({
    elements,
    cy: _cy, // We don't want to propagate this ref arg
    ...props
  }: HTMLAttributes<HTMLDivElement> & {
    elements: ElementDefinition[];
    cy: (() => void) | undefined;
  }) => (
    <div data-mocked='CytoscapeComponent' {...props}>
      {JSON.stringify(elements)}
    </div>
  ),
}));
vi.mock('react', async () => ({
  ...(await vi.importActual('react')),
  useRef: vi.fn(() => ({ current: null })),
}));

describe('KnowledgeGraph', () => {
  it('should render correctly', () => {
    const { getByTestId } = renderWithProviders(
      <KnowledgeGraph kgDataSource={kgDataSource} />
    );
    expect(getByTestId('clear-button')).toBeInTheDocument();
  });
  it('should fit to screen on fit button clicked', async () => {
    const useRefMock = useRef as Mock;

    const fakeCy = {
      current: {
        off: vi.fn(),
        on: vi.fn(),
        resize: vi.fn(),
        center: vi.fn(),
        fit: vi.fn(),
        zoom: vi.fn(),
      },
    };

    useRefMock.mockReturnValueOnce(fakeCy);

    const { findByTestId } = renderWithProviders(
      <KnowledgeGraph kgDataSource={kgDataSource} />
    );
    const sut = await findByTestId('fit-button');

    fireEvent.click(sut);

    expect(fakeCy.current.fit).toBeCalled();
  });

  it('should center on screen when center button clicked', async () => {
    const useRefMock = useRef as Mock;

    const fakeCy = {
      current: {
        off: vi.fn(),
        on: vi.fn(),
        resize: vi.fn(),
        center: vi.fn(),
        fit: vi.fn(),
        zoom: vi.fn(),
      },
    };

    useRefMock.mockReturnValueOnce(fakeCy);

    const { findByTestId } = renderWithProviders(
      <KnowledgeGraph kgDataSource={kgDataSource} />
    );
    const sut = await findByTestId('center-button');

    fireEvent.click(sut);

    expect(fakeCy.current.center).toBeCalled();
  });

  it('should zoom in when zoom in button clicked', async () => {
    const useRefMock = useRef as Mock;

    const fakeCy = {
      current: {
        height: vi.fn(() => 500),
        width: vi.fn(() => 500),
        off: vi.fn(),
        on: vi.fn(),
        resize: vi.fn(),
        center: vi.fn(),
        fit: vi.fn(),
        zoom: vi.fn(() => 0.1),
      },
    };

    useRefMock.mockReturnValueOnce(fakeCy);

    const { findByTestId } = renderWithProviders(
      <KnowledgeGraph kgDataSource={kgDataSource} />
    );
    const sut = await findByTestId('zoom-in-button');

    fireEvent.click(sut);

    expect(fakeCy.current.zoom).toBeCalledWith({
      level: 0.1 + ZOOM_INTERVAL,
      renderedPosition: { x: 250, y: 250 },
    });
  });

  it('should zoom out when zoom out button clicked', async () => {
    const useRefMock = useRef as Mock;

    const fakeCy = {
      current: {
        height: vi.fn(() => 500),
        width: vi.fn(() => 500),
        off: vi.fn(),
        on: vi.fn(),
        resize: vi.fn(),
        center: vi.fn(),
        fit: vi.fn(),
        zoom: vi.fn(() => 0.1),
      },
    };

    useRefMock.mockReturnValueOnce(fakeCy);

    const { findByTestId } = renderWithProviders(
      <KnowledgeGraph kgDataSource={kgDataSource} />
    );
    const sut = await findByTestId('zoom-out-button');

    fireEvent.click(sut);

    expect(fakeCy.current.zoom).toBeCalledWith({
      level: 0.1 - ZOOM_INTERVAL,
      renderedPosition: { x: 250, y: 250 },
    });
  });

  it('should find Search, Explore and Clear button', async () => {
    const { queryByText } = renderWithProviders(
      <KnowledgeGraph kgDataSource={kgDataSource} />,
      {}
    );
    const searchButton = queryByText('Search');
    expect(searchButton).toBeVisible;
    const exploreButton = queryByText('explore-button');
    expect(exploreButton).toBeVisible;
    const clearButton = queryByText('clear-button');
    expect(clearButton).toBeVisible;
  });
});
