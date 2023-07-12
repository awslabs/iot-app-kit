import React from 'react';
import { render, screen } from '@testing-library/react';

import { useSvgParser } from './useSvgParser';
import { DecodeSvgString } from './DecodeSvgString';

jest.mock('./useSvgParser'); // Mocking the useSvgParser module

describe('DecodeSvgString', () => {
  const mockSvgCode = '<svg>...</svg>'; // Mocked svgCode value

  beforeEach(() => {
    useSvgParser.mockReturnValue({
      svgCode: mockSvgCode,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders component with all required props and correct img attributes', () => {
    const selectedColor = '#FF0000';
    const iconString = '<svg>...</svg>';
    const width = '100';
    const height = '100';

    render(<DecodeSvgString selectedColor={selectedColor} iconString={iconString} width={width} height={height} />);

    const imgElement = screen.getByRole('img');
    expect(useSvgParser).toHaveBeenCalledWith({
      selectedColor,
      iconString,
      width,
      height,
    });
  });
});
