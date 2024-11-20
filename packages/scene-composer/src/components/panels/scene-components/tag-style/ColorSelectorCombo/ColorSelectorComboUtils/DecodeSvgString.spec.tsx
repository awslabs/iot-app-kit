import { render } from '@testing-library/react';

import { DecodeSvgString } from './DecodeSvgString';
import { useSvgParser } from './useSvgParser';

vi.mock('./useSvgParser'); // Mocking the useSvgParser module

describe('DecodeSvgString', () => {
  const mockSvgCode = '<svg>...</svg>'; // Mocked svgCode value

  beforeEach(() => {
    useSvgParser.mockReturnValue({
      svgCode: mockSvgCode,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders component with all required props and correct img attributes', () => {
    const mockSelectedColor = '#FF0000';
    const mockIconString = '<svg>...</svg>';
    const width = '100';
    const height = '100';

    render(
      <DecodeSvgString selectedColor={mockSelectedColor} iconString={mockIconString} width={width} height={height} />,
    );
    expect(useSvgParser).toHaveBeenCalledWith({
      selectedColor: mockSelectedColor,
      iconString: mockIconString,
    });
  });
});
