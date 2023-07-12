import { renderHook, act } from '@testing-library/react-hooks';

import { useSvgParser } from './useSvgParser';

describe('useSvgParser', () => {
  it('should have a valid SVG string with selected color ', () => {
    const mockIconString =
      'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgc3R5bGU9ImZpbGw6cmVkOyIgLz4KPC9zdmc+Cg==';
    const mockSelectedColor = '#FF0000';
    const mockWidth = '100';
    const mockHeight = '100';

    const { result } = renderHook(() =>
      useSvgParser({
        selectedColor: mockSelectedColor,
        iconString: mockIconString,
        width: mockWidth,
        height: mockHeight,
      }),
    );

    // Retrieve the values from the hook result
    const { svgCode, width, height } = result.current;

    // Assertions
    expect(svgCode).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">\n' +
        '  <circle cx="50" cy="50" r="50" style="fill:red;" fill="#FF0000"/>\n' +
        '</svg>',
    );
    expect(width).toBe(mockWidth);
    expect(height).toBe(mockHeight);
  });

  it('should handle invalid SVG string', () => {
    const mockIconString = '';
    const mockSelectedColor = '#00FF00';
    const mockWidth = '50';
    const mockHeight = '50';

    const { result } = renderHook(() =>
      useSvgParser({
        selectedColor: mockSelectedColor,
        iconString: mockIconString,
        width: mockWidth,
        height: mockHeight,
      }),
    );

    // Retrieve the values from the hook result
    const { svgCode, width, height } = result.current;

    // Assertions
    expect(svgCode).toBe(
      '<parsererror xmlns="http://www.mozilla.org/newlayout/xml/parsererror.xml">1:0: document must contain a root element.</parsererror>',
    );
    expect(width).toBe(mockWidth);
    expect(height).toBe(mockHeight);
  });

  it('should parse SVG with no selected color', () => {
    const mockIconString =
      'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgc3R5bGU9ImZpbGw6cmVkOyIgLz4KPC9zdmc+Cg==';
    const mockSelectedColor = '';
    const mockWidth = '75';
    const mockHeight = '75';

    const { result } = renderHook(() =>
      useSvgParser({
        selectedColor: mockSelectedColor,
        iconString: mockIconString,
        width: mockWidth,
        height: mockHeight,
      }),
    );

    // Retrieve the values from the hook result
    const { svgCode, width, height } = result.current;

    // Assertions
    expect(svgCode).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">\n' +
        '  <circle cx="50" cy="50" r="50" style="fill:red;" fill=""/>\n' +
        '</svg>',
    );
    expect(width).toBe(mockWidth);
    expect(height).toBe(mockHeight);
  });
});
