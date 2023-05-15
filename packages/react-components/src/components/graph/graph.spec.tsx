import React, { HTMLAttributes, useRef } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Graph, ZOOM_INTERVAL } from './graph';
import { ElementDefinition } from 'cytoscape';

jest.mock('@awsui/components-react/container', () => (props: HTMLAttributes<HTMLDivElement>) => (
  <div data-mocked='Container' {...props}></div>
));

jest.mock(
  'react-cytoscapejs',
  () =>
    ({
      elements,
      cy: _cy, // We don't want to propagate this ref arg
      ...props
    }: HTMLAttributes<HTMLDivElement> & { elements: ElementDefinition[]; cy: (() => void) | undefined }) =>
      (
        <div data-mocked='CytoscapeComponent' {...props}>
          {JSON.stringify(elements)}
        </div>
      )
);

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: jest.fn(() => ({ current: null })),
}));

jest.mock('./hooks/useCyEvent');

describe('<graph />', () => {
  it('renders default elements', () => {
    const { container } = render(<Graph />);
    expect(container).toMatchSnapshot();
  });

  it('should resize and center on load', () => {
    const useRefMock = useRef as jest.Mock;

    const fakeCy = {
      current: {
        resize: jest.fn(),
        center: jest.fn(),
        fit: jest.fn(),
        zoom: jest.fn(),
      },
    };

    useRefMock.mockReturnValueOnce(fakeCy);

    render(<Graph />);

    expect(fakeCy.current.resize).toHaveBeenCalled();
    expect(fakeCy.current.center).toHaveBeenCalled();
  });

  it('should fit to screen on fit button clicked', async () => {
    const useRefMock = useRef as jest.Mock;

    const fakeCy = {
      current: {
        resize: jest.fn(),
        center: jest.fn(),
        fit: jest.fn(),
        zoom: jest.fn(),
      },
    };

    useRefMock.mockReturnValueOnce(fakeCy);

    const { findByTestId } = render(<Graph />);
    const sut = await findByTestId('fit-button');

    fireEvent.click(sut);

    expect(fakeCy.current.fit).toBeCalled();
  });

  it('should center on screen when center button clicked', async () => {
    const useRefMock = useRef as jest.Mock;

    const fakeCy = {
      current: {
        resize: jest.fn(),
        center: jest.fn(),
        fit: jest.fn(),
        zoom: jest.fn(),
      },
    };

    useRefMock.mockReturnValueOnce(fakeCy);

    const { findByTestId } = render(<Graph />);
    const sut = await findByTestId('center-button');

    fireEvent.click(sut);

    expect(fakeCy.current.center).toBeCalled();
  });

  it('should zoom in when zoom in button clicked', async () => {
    const useRefMock = useRef as jest.Mock;

    const fakeCy = {
      current: {
        resize: jest.fn(),
        center: jest.fn(),
        fit: jest.fn(),
        zoom: jest.fn(() => 1),
      },
    };

    useRefMock.mockReturnValueOnce(fakeCy);

    const { findByTestId } = render(<Graph />);
    const sut = await findByTestId('zoom-in-button');

    fireEvent.click(sut);

    expect(fakeCy.current.zoom).toBeCalledWith(1 + ZOOM_INTERVAL);
  });

  it('should zoom out when zoom out button clicked', async () => {
    const useRefMock = useRef as jest.Mock;

    const fakeCy = {
      current: {
        resize: jest.fn(),
        center: jest.fn(),
        fit: jest.fn(),
        zoom: jest.fn(() => 1),
      },
    };

    useRefMock.mockReturnValueOnce(fakeCy);

    const { findByTestId } = render(<Graph />);
    const sut = await findByTestId('zoom-out-button');

    fireEvent.click(sut);

    expect(fakeCy.current.zoom).toBeCalledWith(1 - ZOOM_INTERVAL);
  });
});
