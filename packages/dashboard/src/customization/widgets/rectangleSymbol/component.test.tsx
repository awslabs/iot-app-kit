import React from 'react';
import { render } from '@testing-library/react';

import RectangleWidgetComponent from './component';

describe('Rectangle Widget', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  type RectangleBorderStyle = 'solid' | 'dashed' | 'dotted';
  [
    {
      borderStyle: 'solid' as RectangleBorderStyle,
      fill: 'none',
      borderColor: 'black',
      borderThickness: 5,
    },
    {
      borderStyle: 'dashed' as RectangleBorderStyle,
      fill: 'none',
      borderColor: 'black',
      borderThickness: 5,
    },
    {
      borderStyle: 'dotted' as RectangleBorderStyle,
      fill: 'none',
      borderColor: 'black',
      borderThickness: 5,
    },
    {
      borderStyle: 'solid' as RectangleBorderStyle,
      fill: 'red',
      borderColor: 'black',
      borderThickness: 5,
    },
    {
      borderStyle: 'dashed' as RectangleBorderStyle,
      fill: 'red',
      borderColor: 'black',
      borderThickness: 10,
    },
    {
      borderStyle: 'dotted' as RectangleBorderStyle,
      fill: 'blue',
      borderColor: 'black',
      borderThickness: 15,
    },
    {
      borderStyle: 'solid' as RectangleBorderStyle,
      fill: 'green',
      borderColor: 'white',
      borderThickness: 20,
    },
    {
      borderStyle: 'dashed' as RectangleBorderStyle,
      fill: 'yellow',
      borderColor: 'red',
      borderThickness: 25,
    },
    {
      borderStyle: 'dotted' as RectangleBorderStyle,
      fill: 'purple',
      borderColor: 'blue',
      borderThickness: 30,
    },
  ].forEach((properties) => {
    it(`should render with ${JSON.stringify(properties)} correctly`, () => {
      const { borderStyle, fill, borderColor, borderThickness } = properties;

      const { container } = render(
        <RectangleWidgetComponent
          id='some-id'
          x={1}
          y={2}
          z={3}
          height={100}
          width={100}
          type='rectangle-widget'
          properties={{ borderStyle, fill, borderColor, borderThickness }}
        />
      );

      expect(container).toMatchSnapshot();
    });
  });
});
