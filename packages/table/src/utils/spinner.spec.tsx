import React from 'react';
import * as ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { LoadingSpinner } from './spinner';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
describe('size', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => {
      ReactDOM.unmountComponentAtNode(container);
      container.remove();
    });
  });

  it('does not specify height and width when no size provided', async () => {
    act(() => {
      ReactDOM.render(<LoadingSpinner />, container);
    });

    const svgElement = container.getElementsByTagName('svg').item(0)!;

    expect(svgElement.style.height).toBe('');
    expect(svgElement.style.width).toBe('');
  });

  it('does specify height and width when size provided', async () => {
    const SIZE = 34;
    act(() => {
      ReactDOM.render(<LoadingSpinner size={SIZE} />, container);
    });
    const svgElement = container.getElementsByTagName('svg').item(0)!;
    expect(svgElement.style.height).toBe(`${SIZE}px`);
    expect(svgElement.style.width).toBe(`${SIZE}px`);
  });
});

describe('dark mode', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => {
      ReactDOM.unmountComponentAtNode(container);
      container.remove();
    });
  });

  it('does not have the dark class present when dark is false', async () => {
    act(() => {
      ReactDOM.render(<LoadingSpinner />, container);
    });
    const svgElement = container.getElementsByTagName('svg').item(0)!;
    expect(svgElement.classList).not.toContain('dark');
  });

  it('does not have the dark class present when dark is false', async () => {
    act(() => {
      ReactDOM.render(<LoadingSpinner dark />, container);
    });
    const svgElement = container.getElementsByTagName('svg').item(0)!;
    expect(svgElement.classList).toContain('dark');
  });
});
