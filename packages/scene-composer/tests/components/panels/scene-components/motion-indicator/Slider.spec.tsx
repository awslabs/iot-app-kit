import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { Slider } from '../../../../../src/components/panels/scene-components/motion-indicator/Slider';

describe('Slider', () => {
  it('should render correctly', () => {
    const { container } = render(<Slider max={100} min={10} step={0.5} value={4} />);
    expect(container).toMatchSnapshot();
  });

  it('should select binding', () => {
    let value;
    const onChange = jest.fn().mockImplementation((e) => (value = e.target.value));
    render(<Slider max={100} min={10} step={0.5} value={4} onChange={onChange} />);

    fireEvent.change(screen.getByTestId('slider'), { target: { value: 25 } });

    expect(onChange).toBeCalledTimes(1);
    expect(value).toEqual('25');
  });
});
