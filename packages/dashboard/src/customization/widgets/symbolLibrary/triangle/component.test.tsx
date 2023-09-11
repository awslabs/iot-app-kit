import React from 'react';
import { render } from '@testing-library/react';
import TriangleWidgetComponent from './component';

jest.mock('~/components/actions/useGridSettings', () => ({
  useGridSettings: () => ({
    cellSize: 40,
  }),
}));

describe('Triangle Widget', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  type TriangleBorderStyle = 'solid' | 'dashed' | 'dotted';

  const testCases = [
    {
      height: 1,
      width: 2,
      properties: {
        borderStyle: 'solid' as TriangleBorderStyle,
        fill: 'none',
        borderColor: 'black',
        borderThickness: 5,
      },
    },
    {
      height: 3,
      width: 4,
      properties: {
        borderStyle: 'dashed' as TriangleBorderStyle,
        fill: 'none',
        borderColor: 'black',
        borderThickness: 5,
      },
    },
    {
      height: 12,
      width: 1,
      properties: {
        borderStyle: 'dotted' as TriangleBorderStyle,
        fill: 'none',
        borderColor: 'black',
        borderThickness: 5,
      },
    },
    {
      height: 2,
      width: 3,
      properties: {
        borderStyle: 'solid' as TriangleBorderStyle,
        fill: 'red',
        borderColor: 'black',
        borderThickness: 5,
      },
    },
    {
      height: 1,
      width: 12,
      properties: {
        borderStyle: 'dashed' as TriangleBorderStyle,
        fill: 'red',
        borderColor: 'black',
        borderThickness: 10,
      },
    },
    {
      height: 4,
      width: 5,
      properties: {
        borderStyle: 'dotted' as TriangleBorderStyle,
        fill: 'blue',
        borderColor: 'black',
        borderThickness: 15,
      },
    },
    {
      height: 3,
      width: 1,
      properties: {
        borderStyle: 'solid' as TriangleBorderStyle,
        fill: 'green',
        borderColor: 'white',
        borderThickness: 20,
      },
    },
    {
      height: 5,
      width: 12,
      properties: {
        borderStyle: 'dashed' as TriangleBorderStyle,
        fill: 'yellow',
        borderColor: 'red',
        borderThickness: 25,
      },
    },
    {
      height: 12,
      width: 2,
      properties: {
        borderStyle: 'dotted' as TriangleBorderStyle,
        fill: 'purple',
        borderColor: 'blue',
        borderThickness: 30,
      },
    },
  ];

  testCases.forEach((testCase) => {
    const { height, width, properties } = testCase;

    it(`should render with height=${height} cells, width=${width} cells and properties=${JSON.stringify(
      properties
    )} correctly`, () => {
      const { borderStyle, fill, borderColor, borderThickness } = properties;

      const { container } = render(
        <TriangleWidgetComponent
          id='some-id'
          x={1}
          y={2}
          z={3}
          height={height}
          width={width}
          type='triangle-widget'
          properties={{ borderStyle, fill, borderColor, borderThickness }}
        />
      );

      expect(container).toMatchSnapshot();
    });
  });
});
